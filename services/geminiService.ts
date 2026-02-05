
import { GoogleGenAI } from "@google/genai";
import { Transaction } from "../types";

export class GeminiService {
  /**
   * Generates structured financial advice based on transaction patterns.
   */
  async getFinancialAdvice(transactions: Transaction[], budgets: any[] = []): Promise<string> {
    try {
      if (transactions.length === 0) return "Add some transactions for this month to get AI feedback! ✨";

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const summary = transactions.slice(0, 50).map(t => `${t.type}: ₹${t.amount} (${t.category} - ${t.title})`).join(', ');
      
      const prompt = `
        User Stats Summary: ${summary}
        Context: You are a professional financial strategist for an Indian user managing their income and expenses in INR.
        Task: Provide 3 high-impact, punchy financial observations.
        
        Formatting Rules:
        - Use **bold** for key numbers or terms.
        - Use bullet points (-).
        - Use a maximum of 2-3 sentences per point.
        - Be direct and objective.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          temperature: 0.7 
        }
      });

      return response.text || "Your current tracking is solid. Maintain this discipline.";
    } catch (error) {
      console.error("Gemini AI Feedback Error:", error);
      return "Unable to connect to AI advisor. Please try later.";
    }
  }

  /**
   * Handles interactive conversational chat about user finances with Markdown support.
   */
  async chatWithAdvisor(query: string, transactions: Transaction[], history: {role: string, text: string}[]): Promise<string> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const summary = transactions.map(t => `${t.type}: ₹${t.amount} (${t.category} - ${t.title})`).join(', ');
      
      const systemInstruction = `
        You are 'RupeeFlow AI', a professional and friendly Indian financial strategist. 
        The user manages their finances in INR. 
        Current Context: ${summary}.
        
        Style Rules:
        1. Always use **Markdown** (bold, bullet points) to make your response readable.
        2. Keep it conversational but data-driven.
        3. If identifying a spending problem, suggest a specific **actionable solution**.
        4. Focus on Indian context (investments like FD, SIP, Gold, etc. if relevant).
        5. Limit responses to 2-3 short paragraphs.
      `;

      const prompt = `
        System Instruction: ${systemInstruction}
        Recent History: ${JSON.stringify(history.slice(-5))}
        User's Message: ${query}
        
        Please respond to the user using clear Markdown formatting.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      return response.text || "I'm processing that. Could you please rephrase your question?";
    } catch (error) {
      console.error("Gemini AI Chat Error:", error);
      return "I'm having trouble connecting to my central brain. Please ask again in a moment!";
    }
  }
}

export const geminiService = new GeminiService();
