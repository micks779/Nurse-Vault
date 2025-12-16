// Supabase Edge Function to securely proxy Google Gemini API calls
// This keeps the API key server-side and prevents exposure in the frontend

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface GeminiRequest {
  type: 'transcribe' | 'chat' | 'analyze_jd' | 'recommendations';
  data: any;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the API key from Supabase secrets
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    
    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY not found in Supabase secrets");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify user is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Supabase client to verify auth
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const requestBody: GeminiRequest = await req.json();
    const { type, data } = requestBody;

    // Rate limiting: Check user's API usage for today
    const { data: usageToday, error: usageError } = await supabaseClient
      .rpc('get_user_api_usage_today', { p_user_id: user.id });

    const dailyLimit = 10; // 10 AI calls per user per day
    const callsToday = usageToday || 0;

    if (callsToday >= dailyLimit) {
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded",
          message: `You've reached your daily limit of ${dailyLimit} AI calls. Please try again tomorrow.`,
          limit: dailyLimit,
          used: callsToday,
          resetTime: new Date(new Date().setHours(24, 0, 0, 0)).toISOString() // Next midnight
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let geminiResponse;

    switch (type) {
      case "transcribe": {
        // Transcribe audio and categorize
        const { base64Audio, mimeType } = data;
        const prompt = `Transcribe this audio verbatim. Then, analyze the content and categorize it into one of these types: 'CPD', 'Reflection', 'Competency'. Return the result as a JSON object with 'transcription' and 'suggestion' fields.`;

        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      inlineData: {
                        mimeType: mimeType,
                        data: base64Audio,
                      },
                    },
                    { text: prompt },
                  ],
                },
              ],
              systemInstruction: {
                parts: [
                  {
                    text: "You are a transcription assistant. Transcribe the user's audio. Then, analyze the content and categorize it into one of these types: 'CPD', 'Reflection', 'Competency'. Return the result as a JSON object with 'transcription' and 'suggestion' fields.",
                  },
                ],
              },
              generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: "object",
                  properties: {
                    transcription: { type: "string" },
                    suggestion: {
                      type: "string",
                      enum: ["CPD", "Reflection", "Competency"],
                    },
                  },
                },
              },
            }),
          }
        );
        break;
      }

      case "chat": {
        // Career guidance chat
        const { userMessage, currentPath, competencies } = data;
        const prompt = `You are a career guidance assistant for healthcare professionals. The user is asking: "${userMessage}"

Current career path: ${currentPath ? `Band ${currentPath.currentBand} → Band ${currentPath.targetBand} (${currentPath.specialty || 'General'})` : 'Not set'}
Current competencies: ${competencies.length > 0 ? competencies.map(c => c.name).join(', ') : 'None logged yet'}

Provide a helpful, conversational response. Be specific about:
- What skills/competencies they might need
- Training opportunities
- Steps to achieve their goals
- How their current competencies relate to their goals

Keep responses concise but informative (2-3 paragraphs max).`;

        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              systemInstruction: {
                parts: [
                  {
                    text: "You are a friendly, knowledgeable career guidance assistant for healthcare professionals. Provide practical, actionable advice. Be encouraging and specific.",
                  },
                ],
              },
            }),
          }
        );
        break;
      }

      case "analyze_jd": {
        // Analyze job description and create career path
        const { jobDescription, currentBand, targetBand, specialty, competencies } = data;
        const prompt = `Analyze this job description and create a personalized career path for a healthcare professional.

Job Description:
${jobDescription}

Current Situation:
- Current Band: ${currentBand || 'Not specified'}
- Target Band: ${targetBand || 'Not specified'}
- Specialty: ${specialty || 'Not specified'}
- Current Competencies: ${competencies.length > 0 ? competencies.map(c => c.name).join(', ') : 'None logged yet'}

Based on this job description, create a list of specific requirements needed to achieve this role. For each requirement, provide:
- "title": Clear, actionable requirement name
- "description": Detailed explanation of what's needed
- "priority": "High", "Medium", or "Low"

IMPORTANT: Return ONLY valid JSON, no markdown formatting. Return a JSON object with an "analysis" field (string) and a "requirements" array. Each requirement should have "title", "description", and "priority" fields.`;

        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              systemInstruction: {
                parts: [
                  {
                    text: "You are a career pathway expert for healthcare professionals. Analyze job descriptions and create actionable, specific requirements. Always return valid JSON.",
                  },
                ],
              },
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );
        break;
      }

      case "recommendations": {
        // Generate CPD recommendations
        const { currentBand, targetBand, specialty } = data;
        const prompt = `Generate personalized CPD recommendations for a healthcare professional.

Current Band: ${currentBand}
Target Band: ${targetBand}
Specialty: ${specialty || 'General'}

Create 3-5 specific, actionable CPD recommendations. For each, provide:
- "title": Clear recommendation title
- "description": What they should do and why
- "category": One of: "Training", "Reading", "Practice", "Networking", "Research"
- "priority": "High", "Medium", or "Low"

Return ONLY valid JSON with a "recommendations" array.`;

        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
              systemInstruction: {
                parts: [
                  {
                    text: "You are a CPD advisor for healthcare professionals. Provide specific, actionable recommendations. Always return valid JSON.",
                  },
                ],
              },
              generationConfig: {
                responseMimeType: "application/json",
              },
            }),
          }
        );
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid request type" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({
          error: "AI service error",
          details: errorText,
        }),
        {
          status: geminiResponse.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const geminiData = await geminiResponse.json();
    const result = geminiData.candidates?.[0]?.content?.parts?.[0];

    // Estimate tokens used (rough calculation: ~4 chars per token)
    const inputTokens = JSON.stringify(data).length / 4;
    const outputTokens = result?.text ? result.text.length / 4 : 0;
    const totalTokens = Math.ceil(inputTokens + outputTokens);

    // Track API usage in database (fire and forget - don't block response)
    supabaseClient
      .from('api_usage')
      .insert({
        user_id: user.id,
        type: type,
        tokens_used: totalTokens,
        created_at: new Date().toISOString()
      })
      .then(() => console.log(`Tracked API usage: ${type} for user ${user.id}`))
      .catch((err) => console.error('Error tracking API usage:', err));

    // Handle JSON responses (for transcribe, analyze_jd, recommendations)
    if (result?.text) {
      try {
        const parsed = JSON.parse(result.text);
        // Add usage info to response
        const responseWithUsage = {
          ...parsed,
          _usage: {
            callsToday: callsToday + 1,
            limit: dailyLimit,
            remaining: dailyLimit - (callsToday + 1)
          }
        };
        return new Response(JSON.stringify(responseWithUsage), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (parseError) {
        // If not JSON, return as text (for chat responses)
        const responseWithUsage = {
          result: result.text,
          _usage: {
            callsToday: callsToday + 1,
            limit: dailyLimit,
            remaining: dailyLimit - (callsToday + 1)
          }
        };
        return new Response(JSON.stringify(responseWithUsage), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Handle case where response structure is different
    if (result && !result.text) {
      console.error("Unexpected response structure:", JSON.stringify(geminiData));
      return new Response(
        JSON.stringify({ error: "Unexpected response format from AI service" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "No response from AI service" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

