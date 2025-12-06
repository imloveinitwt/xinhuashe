
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// Note: In a real production app, ensure your API key is secure.
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const AIService = {
  /**
   * Check if AI service is available (API Key present)
   */
  isAvailable: () => !!ai,

  /**
   * Analyze an image and generate relevant tags using Gemini 2.5 Flash
   * @param imageBase64 Base64 string of the image
   * @param mimeType Mime type of the image (e.g., 'image/png')
   */
  generateImageTags: async (imageBase64: string, mimeType: string = 'image/png'): Promise<string[]> => {
    if (!ai) {
      console.warn("AI Service not initialized: Missing API Key");
      await new Promise(r => setTimeout(r, 1000)); // Simulate delay
      return ['模拟标签_AI未配置', '赛博朋克', '高质量'];
    }

    try {
      const model = "gemini-2.5-flash";
      const prompt = "Analyze this image and provide 5-8 relevant descriptive tags in Simplified Chinese. Return ONLY the tags separated by commas, no other text.";
      
      const response = await ai.models.generateContent({
        model: model,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: mimeType,
                  data: imageBase64
                }
              }
            ]
          }
        ]
      });

      const text = response.text;
      if (!text) return [];

      // Process the response string into an array
      const tags = text.split(/[,，、]/).map(t => t.trim()).filter(t => t.length > 0);
      return tags;
    } catch (error) {
      console.error("Gemini Vision Analysis Failed:", error);
      throw new Error("AI 分析失败，请稍后重试");
    }
  },

  /**
   * Expand a short creative prompt into a detailed description
   * @param inputPrompt Short user input
   */
  expandCreativePrompt: async (inputPrompt: string): Promise<string> => {
    if (!ai) {
      await new Promise(r => setTimeout(r, 1000));
      return `[模拟AI扩充]: 基于您输入的 "${inputPrompt}"，建议增加细节描述：画面采用赛博朋克风格，霓虹灯光效显著，构图采用三分法...`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a professional creative director. Expand the following short art prompt into a detailed, high-quality image generation prompt (in Chinese), focusing on lighting, composition, style, and mood. Keep it under 150 words. Input: "${inputPrompt}"`,
      });

      return response.text || "无法生成描述";
    } catch (error) {
      console.error("Gemini Text Generation Failed:", error);
      throw new Error("创意扩充失败");
    }
  }
};
