import { GoogleGenAI, Type } from "@google/genai";
import { VoiceLog, Reflection, Recommendation } from "../types";

// Initialize Gemini
// Note: In production, this should use Supabase Edge Function to keep API key secure
// For now, we use it directly in development (not recommended for production)
const apiKey = import.meta.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const aiService = {
  /**
   * Transcribes audio and provides a suggested categorization.
   * @param base64Audio Base64 encoded audio string (no data prefix)
   * @param mimeType Audio mime type (e.g. 'audio/webm')
   */
  processVoiceNote: async (base64Audio: string, mimeType: string): Promise<{ transcription: string, suggestion: 'CPD' | 'Reflection' | 'Competency' }> => {
    if (!apiKey || !ai) {
      // Mock fallback if no key provided
      console.warn('⚠️ GEMINI_API_KEY not set - using mock transcription');
      return new Promise(resolve => setTimeout(() => resolve({
        transcription: "I attended a seminar on infection control today. We learned about the new protocols for PPE and hand hygiene compliance in high-risk wards.",
        suggestion: 'CPD'
      }), 1500));
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType: mimeType,
                        data: base64Audio
                    }
                },
                {
                    text: "Transcribe this audio verbatim."
                }
            ]
        },
        config: {
            systemInstruction: "You are a transcription assistant. Transcribe the user's audio. Then, analyze the content and categorize it into one of these types: 'CPD', 'Reflection', 'Competency'. Return the result as a JSON object with 'transcription' and 'suggestion' fields.",
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    transcription: { type: Type.STRING },
                    suggestion: { type: Type.STRING, enum: ['CPD', 'Reflection', 'Competency'] }
                }
            }
        }
      });

      const result = JSON.parse(response.text || '{}');
      return {
          transcription: result.transcription || "Transcription failed.",
          suggestion: result.suggestion || "CPD"
      };

    } catch (error) {
      console.error("Gemini Transcription Error:", error);
      throw new Error("Failed to process voice note.");
    }
  },

  /**
   * Generates reflection prompts based on a topic or transcription.
   */
  getReflectionPrompts: async (context: string): Promise<string[]> => {
    if (!apiKey || !ai) {
      console.warn('⚠️ GEMINI_API_KEY not set - using mock prompts');
      return ["What did you learn?", "How will this change your practice?", "How does this relate to the Code?"];
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User Context/Situation: "${context}"`,
            config: {
                systemInstruction: "You are a clinical nurse educator. Based on the user's context, generate 3 specific, probing reflection questions to help the nurse write a formal NMC revalidation reflection. Return only the questions as a JSON array of strings.",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        
        return JSON.parse(response.text || '[]');
    } catch (e) {
        console.error(e);
        return ["What happened?", "What did you learn?", "What will you do differently?"];
    }
  },

  /**
   * Compiles answers into a structured reflection.
   */
  generateStructuredReflection: async (context: string, questions: string[], answers: string[]): Promise<string> => {
     if (!apiKey || !ai) {
       console.warn('⚠️ GEMINI_API_KEY not set - using mock reflection');
       return "Structured reflection mock content...\n\n**What?**\nI experienced...\n\n**So What?**\nThis matters because...\n\n**Now What?**\nI will...";
     }

     const qaPairs = questions.map((q, i) => `Q: ${q}\nA: ${answers[i]}`).join('\n');
     
     try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Context: ${context}\n\nUser Answers:\n${qaPairs}`,
            config: {
                systemInstruction: "You are a clinical nurse educator. Write a formal, structured reflection (approx 200 words) suitable for a Nursing & Midwifery Council (NMC) portfolio based on the user's answers. Use the 'What? So What? Now What?' model. Format with Markdown headers.",
            }
        });

        return response.text || "Could not generate reflection.";
     } catch (e) {
        console.error(e);
        return "Error generating reflection. Please try again.";
     }
  },

  /**
   * Generates CPD recommendations based on profile.
   */
  getRecommendations: async (currentBand: string, targetBand: string, specialty: string): Promise<Recommendation[]> => {
    if (!apiKey || !ai) {
      console.warn('⚠️ GEMINI_API_KEY not set - using mock recommendations');
      return [
        { id: 'ai-rec-1', title: 'Advanced Leadership in Nursing', type: 'Course', reason: 'Generated for Band 6 progression.', status: 'Pending' }
      ];
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `User Profile: Current ${currentBand}, Target ${targetBand}, Specialty ${specialty}.`,
            config: {
                systemInstruction: "Suggest 3 specific CPD activities or courses that would bridge the gap for this nurse's career progression. Return a JSON array of objects with fields: title, type (Course/Module/Activity), reason, provider, estimatedHours (number).",
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            type: { type: Type.STRING, enum: ['Course', 'Module', 'Activity'] },
                            reason: { type: Type.STRING },
                            provider: { type: Type.STRING },
                            estimatedHours: { type: Type.NUMBER }
                        }
                    }
                }
            }
        });
        const rawRecs = JSON.parse(response.text || '[]');
        return rawRecs.map((r: any, i: number) => ({
            ...r,
            id: `gen-${Date.now()}-${i}`,
            status: 'Pending'
        }));
    } catch (e) {
        console.error(e);
        return [];
    }
  }
};