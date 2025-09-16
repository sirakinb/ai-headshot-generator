
import { GoogleGenAI, Modality } from "@google/genai";
import { UploadedFile } from '../types';

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash-image-preview';

export const generateHeadshot = async (
  images: UploadedFile[],
  prompt: string
): Promise<{ image: string | null; text: string | null }> => {
  try {
    // Create the content array with text prompt and images
    const contentParts = [
      { text: prompt },
      ...images.map(img => ({
        inlineData: {
          data: img.base64,
          mimeType: img.mimeType,
        },
      }))
    ];

    const response = await ai.models.generateContent({
      model,
      contents: contentParts,
    });

    let resultImage: string | null = null;
    let resultText: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64ImageBytes: string = part.inlineData.data;
          resultImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        } else if (part.text) {
          resultText = part.text;
        }
      }
    }
    
    if (!resultImage) {
      resultText = resultText || "Model did not return an image. It might be due to a safety policy violation or an issue with the input images. Please try again with different images or a modified prompt.";
    }

    return { image: resultImage, text: resultText };
  } catch (error) {
    console.error("Error generating headshot:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate headshot: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI.");
  }
};
