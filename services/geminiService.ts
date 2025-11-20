import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GenerationResult {
  imageUrl: string | null;
  error: string | null;
}

export const generateEmotiveWallpaper = async (feeling: string): Promise<GenerationResult> => {
  try {
    const prompt = `
      Generate a vertical abstract phone wallpaper (aspect ratio 9:16).
      
      Visual Constraint (MUST FOLLOW):
      The structural pattern, texture, and movement of the image must resemble a close-up, macro shot of a viscous fluid flow, identical to the physics and patterns of a lava flow. It should have swirling currents, crusting layers, and fluid dynamics.
      
      Creative Freedom (CONDITION ON EMOTION):
      The color palette, lighting, luminosity, and "temperature" of the image must be an abstract interpretation of this feeling: "${feeling}".
      
      - If the feeling is sad/melancholic: Use slow, heavy blues, greys, deep purples. Low contrast.
      - If the feeling is happy/energetic: Use bright, vibrant yellows, pinks, cyans. High contrast.
      - If the feeling is angry: Use jagged, intense reds, blacks, burning oranges.
      - If the feeling is calm: Use smooth, flowing teals, seafoams, whites.
      
      Do not create a literal picture of a person or object. It must be a texture/pattern based abstract art piece. High definition, photorealistic texture rendering, 3D render style.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
        },
      },
    });

    // Parse the response to find the image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
          return { imageUrl, error: null };
        }
      }
    }

    return { imageUrl: null, error: "No image data found in the response." };

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    let errorMessage = "Failed to generate image.";
    if (error.message) {
        errorMessage = error.message;
    }
    return { imageUrl: null, error: errorMessage };
  }
};