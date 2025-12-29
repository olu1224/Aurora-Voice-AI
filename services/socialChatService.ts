import { GoogleGenAI } from "@google/genai";

export class SocialChatService {
  async generateResponse(platform: string, sender: string, message: string, businessContext: string) {
    try {
      // Initialize right before call to capture latest API key from selection dialog
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
          CONTEXT: You are Aurora, the AI Sales Agent for a business.
          PLATFORM: ${platform} Direct Message.
          CUSTOMER: ${sender}.
          INCOMING MESSAGE: "${message}"
          BUSINESS LOGIC: ${businessContext}
          
          TASK: Generate a concise, professional, and high-conversion reply. If they ask about services, qualify their interest. If they want to book, tell them you'll have an agent call or provide a booking link. 
          Keep it under 300 characters. Tone should be appropriate for ${platform}.
        `,
      });

      return response.text || "I've received your message and our team will get back to you shortly.";
    } catch (err) {
      console.error("Social AI Fault:", err);
      return "Hello! Thanks for reaching out. How can I help you today?";
    }
  }
}

export const socialAI = new SocialChatService();