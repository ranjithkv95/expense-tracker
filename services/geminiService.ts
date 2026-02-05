
import { GoogleGenAI } from "@google/genai";
import { Transaction, Budget } from "../types";

export class GeminiService {
  /**
   * Generates financial advice based on transaction patterns and budgets.
   * Initializes a new GoogleGenAI instance right before use to ensure the most current configuration is used.
   */
  async getFinancialAdvice(transactions: Transaction[], budgets: Budget[]): Promise<string> {
    try {
      if (transactions.length === 0) return "Add some transactions for this month to get AI feedback! ✨";

      // Initialize GoogleGenAI right before use to follow SDK guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      
      const summary = transactions.slice(0, 20).map(t => `${t.type}: ₹${t.amount} (${t.category})`).join(', ');
      
      const prompt = `
        User Stats: ${summary}
        Task: Provide 3 ultra-short, punchy (max 10 words each) financial "pro-tips" for this specific month's pattern in INR.
        Format: Bullet points. One for savings, one for specific category observation, one general.
      `;

      // Use the recommended model for text tasks
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          temperature: 0.5 
        }
      });

      // Directly access the .text property from GenerateContentResponse
      return response.text || "Tracking well! Keep going.";
    } catch (error) {
      console.error("Gemini AI Feedback Error:", error);
      return "Unable to connect to AI advisor. Please try later.";
    }
  }
}

export const geminiService = new GeminiService();
