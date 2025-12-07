
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
      return `[模拟AI扩充]: 基于主题 "${inputPrompt}"，建议核心视觉元素包含... 构图采用三分法，光影强调对比度...`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ 
              text: `
                你是一位世界级的美术指导和提示词工程师。请将用户的简短想法扩充为一份高质量的图像生成提示词（Prompt）。
                
                **核心优化要求：**
                1. **核心元素识别**：深入分析主题，识别并提取高度相关的核心视觉元素。
                2. **构图融合**：将这些元素有机地融入图片构图中，确保布局合理，避免元素堆砌。
                3. **视觉层次**：构建清晰的前景、中景、远景关系，确保主体突出，具有良好的视觉层次感。
                4. **风格与质感**：明确整体视觉风格（如：电影感、数字厚涂、超写实等），并保持专业性与一致性。
                5. **光影与氛围**：指定具体的光影类型（如：体积光、边缘光）和色彩基调，以增强氛围感。

                **用户输入：** "${inputPrompt}"
                
                **输出规则：**
                - 仅输出优化后的提示词段落。
                - 语言：简体中文。
                - 字数：200字以内。
              ` 
            }]
          }
        ],
      });

      return response.text || "无法生成描述";
    } catch (error) {
      console.error("Gemini Text Generation Failed:", error);
      throw new Error("创意扩充失败");
    }
  },

  /**
   * Generate an image based on a text prompt
   * @param prompt Text description of the image
   */
  generateImage: async (prompt: string): Promise<string | null> => {
    // Fallback if no API key
    if (!ai) {
      await new Promise(r => setTimeout(r, 1500));
      // Use Pollinations AI for mock generation
      return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000)}`;
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      return null;
    } catch (error) {
      console.error("Image Generation Failed:", error);
      throw new Error("图片生成失败");
    }
  }
};
