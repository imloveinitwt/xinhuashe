
import { GoogleGenAI } from "@google/genai";
import { getImage } from '../mockData'; // Import the local generator

// Initialize the Gemini API client
// Note: In a real production app, ensure your API key is secure.
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export interface ImageGenerationOptions {
  aspectRatio?: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
  style?: string;
}

// Helper to generate a fallback image using local SVG generator
const getFallbackImageUrl = (prompt: string, options: ImageGenerationOptions = {}) => {
  const { aspectRatio = '1:1' } = options;
  // Map aspect ratio to rough dimensions for the SVG generator (though it scales)
  let w = 800;
  let h = 800;
  if (aspectRatio === '16:9') { w = 1024; h = 576; }
  else if (aspectRatio === '9:16') { w = 576; h = 1024; }
  else if (aspectRatio === '3:4') { w = 600; h = 800; }
  else if (aspectRatio === '4:3') { w = 800; h = 600; }
  
  return getImage(prompt, w, h);
};

export const AIService = {
  /**
   * Check if AI service is available (API Key present)
   */
  isAvailable: () => !!ai,

  /**
   * Get a URL-based image generated from prompt. 
   * Useful for saving storage space compared to Base64.
   */
  getPersistableUrl: (prompt: string, options: ImageGenerationOptions = {}) => {
    return getFallbackImageUrl(prompt, options);
  },

  /**
   * Analyze an image and generate relevant tags using Gemini 2.5 Flash
   * @param imageBase64 Base64 string of the image
   * @param mimeType Mime type of the image (e.g., 'image/png')
   */
  generateImageTags: async (imageBase64: string, mimeType: string = 'image/png'): Promise<string[]> => {
    // 1. Check if configured
    if (!ai) {
      console.warn("AI Service not initialized: Missing API Key");
      await new Promise(r => setTimeout(r, 800)); // Simulate delay
      return ['AI模拟', '赛博朋克', '高质量'];
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
      console.warn("Gemini Vision Analysis Failed (Using Fallback):", error);
      // Return fallback tags instead of throwing to prevent UI crash
      return ['自动分析失败', '数字艺术', '待审核'];
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

      return response.text || inputPrompt;
    } catch (error) {
      console.error("Gemini Text Generation Failed:", error);
      // Return original input as fallback
      return inputPrompt;
    }
  },

  /**
   * Generate an image based on a text prompt using Gemini 2.5 Flash Image (Nano Banana)
   * @param prompt Text description of the image
   * @param options Configuration for aspect ratio and style
   */
  generateImage: async (prompt: string, options: ImageGenerationOptions = {}): Promise<string | null> => {
    // 1. Fallback if no API key
    if (!ai) {
      await new Promise(r => setTimeout(r, 1500));
      return getFallbackImageUrl(prompt, options);
    }

    try {
      // 2. Construct an enhanced prompt incorporating the style
      const { aspectRatio = '1:1', style } = options;
      let finalPrompt = prompt;
      if (style && style !== 'None') {
        finalPrompt = `${prompt}, in ${style} style, high quality, highly detailed, professional composition, 8k resolution`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: finalPrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: aspectRatio,
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          }
        }
      }
      
      // If response is valid but no image data found
      console.warn("Gemini returned response but no image data found.");
      return getFallbackImageUrl(prompt, options);

    } catch (error) {
      // 3. Robust Error Handling (CORS, RPC, 500s)
      // Log the specific error for debugging but return a fallback image to the user
      console.warn("Gemini Image Generation Failed (RPC/Network Error), switching to fallback provider.", error);
      return getFallbackImageUrl(prompt, options);
    }
  }
};
