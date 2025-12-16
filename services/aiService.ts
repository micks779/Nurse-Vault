import { VoiceLog, Reflection, Recommendation, CareerPath, Competency, CareerRequirement } from "../types";
import { supabase } from "../lib/supabase";

// Helper function to call the secure Edge Function
async function callEdgeFunction(type: 'transcribe' | 'chat' | 'analyze_jd' | 'recommendations', data: any): Promise<any> {
  try {
    // Get the current session for authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      throw new Error('Not authenticated. Please log in.');
    }

    // Use Supabase client's functions.invoke() method (recommended way)
    const { data: result, error } = await supabase.functions.invoke('gemini-proxy', {
      body: { type, data },
    });

    if (error) {
      console.error('Edge Function error:', error);
      
      // Handle rate limit errors specifically
      if (error.status === 429 || error.message?.includes('Rate limit')) {
        const rateLimitError: any = new Error(error.message || 'Rate limit exceeded');
        rateLimitError.isRateLimit = true;
        rateLimitError.limit = error.limit;
        rateLimitError.used = error.used;
        rateLimitError.resetTime = error.resetTime;
        throw rateLimitError;
      }
      
      throw new Error(error.message || `Edge Function error: ${error.status || 'Unknown'}`);
    }

    if (!result) {
      throw new Error('No response from Edge Function');
    }

    // Extract usage info if present (remove from result)
    const usage = result._usage;
    if (usage) {
      delete result._usage;
      // Store usage info for UI display
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('ai_usage', JSON.stringify(usage));
      }
    }

    return result;
  } catch (error: any) {
    console.error(`Edge Function call failed (${type}):`, error);
    throw error;
  }
}

// Get current API usage stats
export async function getApiUsage(): Promise<{ callsToday: number; limit: number; remaining: number } | null> {
  try {
    const { data, error } = await supabase.rpc('get_user_api_usage_today', {
      p_user_id: (await supabase.auth.getUser()).data.user?.id || ''
    });

    if (error) {
      console.error('Error getting API usage:', error);
      return null;
    }

    const limit = 10; // Daily limit
    const callsToday = data || 0;
    
    return {
      callsToday,
      limit,
      remaining: Math.max(0, limit - callsToday)
    };
  } catch (error) {
    console.error('Error getting API usage:', error);
    return null;
  }
}

export const aiService = {
  /**
   * Transcribes audio and provides a suggested categorization.
   * @param base64Audio Base64 encoded audio string (no data prefix)
   * @param mimeType Audio mime type (e.g. 'audio/webm')
   */
  processVoiceNote: async (base64Audio: string, mimeType: string): Promise<{ transcription: string, suggestion: 'CPD' | 'Reflection' | 'Competency' }> => {
    try {
      const result = await callEdgeFunction('transcribe', {
        base64Audio,
        mimeType,
      });

      return {
        transcription: result.transcription || "Transcription failed.",
        suggestion: result.suggestion || "CPD"
      };
    } catch (error: any) {
      console.error("Voice note processing error:", error);
      // Fallback mock response if Edge Function fails
      console.warn('⚠️ Using mock transcription due to Edge Function error');
      return new Promise(resolve => setTimeout(() => resolve({
        transcription: "I attended a seminar on infection control today. We learned about the new protocols for PPE and hand hygiene compliance in high-risk wards.",
        suggestion: 'CPD'
      }), 1500));
    }
  },

  /**
   * Generates reflection prompts based on a topic or transcription.
   */
  getReflectionPrompts: async (context: string): Promise<string[]> => {
    try {
      // For now, use a simple prompt generation via Edge Function
      // This could be enhanced to use Edge Function if needed
      // For simplicity, we'll use a basic approach
      const result = await callEdgeFunction('chat', {
        userMessage: `Generate 3 specific reflection questions based on this context: ${context}`,
        currentPath: null,
        competencies: [],
      });

      // Try to extract questions from the response
      const text = result.result || result;
      if (typeof text === 'string') {
        // Simple extraction - could be improved
        const questions = text.match(/\d+\.\s*([^?\n]+[?])/g) || 
                         text.split('\n').filter((line: string) => line.includes('?'));
        if (questions.length > 0) {
          return questions.map((q: string) => q.replace(/^\d+\.\s*/, '').trim());
        }
      }

      // Fallback
      return ["What did you learn?", "How will this change your practice?", "How does this relate to the Code?"];
    } catch (error) {
      console.error('Error generating reflection prompts:', error);
      return ["What happened?", "What did you learn?", "What will you do differently?"];
    }
  },

  /**
   * Compiles answers into a structured reflection.
   */
  generateStructuredReflection: async (context: string, questions: string[], answers: string[]): Promise<string> => {
    try {
      const qaPairs = questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n');
      const prompt = `Context: ${context}\n\nUser Answers:\n${qaPairs}\n\nWrite a formal, structured reflection (approx 200 words) suitable for a Nursing & Midwifery Council (NMC) portfolio based on the user's answers. Use the 'What? So What? Now What?' model. Format with Markdown headers.`;

      const result = await callEdgeFunction('chat', {
        userMessage: prompt,
        currentPath: null,
        competencies: [],
      });

      return result.result || "Could not generate reflection.";
    } catch (error: any) {
      console.error('Error generating structured reflection:', error);
      return "Error generating reflection. Please try again.";
    }
  },

  /**
   * Generates NMC-compliant structured reflection from the 4 required questions.
   */
  generateNMCReflection: async (context: string, answers: string[], codeThemes: string[]): Promise<string> => {
    try {
      const nmcQuestions = [
        "What was the nature of the CPD activity and/or practice-related feedback and/or event or experience in your practice?",
        "What did you learn from the CPD activity and/or feedback and/or event or experience in your practice?",
        "How did you change or improve your practice as a result?",
        "How is this relevant to the Code?"
      ];

      const qaPairs = nmcQuestions.map((q, i) => `Q: ${q}\nA: ${answers[i] || 'Not answered'}`).join('\n\n');
      const codeThemesText = codeThemes.length > 0 ? `\n\nCode Themes Selected: ${codeThemes.join(', ')}` : '';
      
      const prompt = `Context: ${context}\n\nNMC Reflective Account Answers:\n${qaPairs}${codeThemesText}\n\nWrite a formal, structured NMC-compliant reflective account (approximately 300-400 words) that weaves together the user's answers to all 4 NMC questions into a coherent narrative. The reflection should:\n- Flow naturally between the 4 questions\n- Demonstrate deep reflection and learning\n- Show clear links to the Code themes selected\n- Be suitable for NMC revalidation submission\n- Use professional nursing language\n\nFormat with clear sections or paragraphs.`;

      const result = await callEdgeFunction('chat', {
        userMessage: prompt,
        currentPath: null,
        competencies: [],
      });

      // Handle different response formats
      if (typeof result === 'string') {
        return result;
      } else if (result?.result) {
        return result.result;
      } else if (result?.text) {
        return result.text;
      } else {
        console.error('Unexpected response format from Edge Function:', result);
        return "Could not generate reflection. Unexpected response format.";
      }
    } catch (error: any) {
      console.error('Error generating NMC reflection:', error);
      // Re-throw to let the UI handle it properly
      throw error;
    }
  },

  /**
   * Generates CPD recommendations based on profile.
   */
  getRecommendations: async (currentBand: string, targetBand: string, specialty: string): Promise<Recommendation[]> => {
    try {
      const result = await callEdgeFunction('recommendations', {
        currentBand,
        targetBand,
        specialty,
      });

      const rawRecs = result.recommendations || [];
      return rawRecs.map((r: any, i: number) => ({
        ...r,
        id: `gen-${Date.now()}-${i}`,
        status: 'Pending' as const,
        type: r.type || 'Course',
        reason: r.description || r.reason || '',
      }));
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  },

  /**
   * Chat-based career guidance - conversational AI assistant
   */
  chatCareerGuidance: async (
    userMessage: string,
    currentPath: CareerPath | null,
    competencies: Competency[]
  ): Promise<string> => {
    try {
      const result = await callEdgeFunction('chat', {
        userMessage,
        currentPath,
        competencies,
      });

      return result.result || "I couldn't generate a response. Please try again.";
    } catch (error: any) {
      console.error('Error in career guidance chat:', error);
      return `I encountered an error: ${error.message || 'Unknown error'}. Please ensure the Edge Function is deployed and configured correctly.`;
    }
  },

  /**
   * Analyze job description and create career path requirements
   */
  analyzeJobDescriptionAndCreatePath: async (
    context: string,
    currentPath: CareerPath
  ): Promise<{ analysis: string; requirements: CareerRequirement[] }> => {
    try {
      // Get competencies for context
      const { data: competencies } = await supabase
        .from('competencies')
        .select('*')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

      const result = await callEdgeFunction('analyze_jd', {
        jobDescription: context,
        currentBand: currentPath.currentBand,
        targetBand: currentPath.targetBand,
        specialty: currentPath.specialty || '',
        competencies: competencies || [],
      });

      // Parse the result
      let analysis = '';
      let requirements: CareerRequirement[] = [];

      if (typeof result === 'string') {
        // Try to parse if it's a JSON string
        try {
          const parsed = JSON.parse(result);
          analysis = parsed.analysis || result;
          requirements = (parsed.requirements || []).map((req: any, idx: number) => ({
            id: `jd-req-${Date.now()}-${idx}`,
            title: req.title || 'Requirement',
            type: (req.type || 'CPD') as CareerRequirement['type'],
            status: 'Not Started' as CareerRequirement['status'],
            description: req.description || '',
            priority: req.priority || 'Medium' as CareerRequirement['priority'],
          }));
        } catch {
          analysis = result;
        }
      } else {
        analysis = result.analysis || "I've analyzed the job description and created a pathway for you.";
        requirements = (result.requirements || []).map((req: any, idx: number) => ({
          id: `jd-req-${Date.now()}-${idx}`,
          title: req.title || 'Requirement',
          type: (req.type || 'CPD') as CareerRequirement['type'],
          status: 'Not Started' as CareerRequirement['status'],
          description: req.description || '',
          priority: req.priority || 'Medium' as CareerRequirement['priority'],
        }));
      }

      return { analysis, requirements };
    } catch (error: any) {
      console.error('Error analyzing job description:', error);
      return {
        analysis: `I encountered an error analyzing the job description: ${error.message || 'Unknown error'}. Please ensure the Edge Function is deployed and configured correctly.`,
        requirements: []
      };
    }
  }
};
