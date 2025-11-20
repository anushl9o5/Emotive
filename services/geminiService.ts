import { GoogleGenAI } from "@google/genai";

// Initialize the client with the API key from the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface GenerationResult {
  imageUrl: string | null;
  error: string | null;
}

/**
 * Adds the "EMOTIVE" watermark to the generated image using HTML5 Canvas.
 * Uses blend modes to ensure the logo looks embedded in the texture.
 */
const addWatermark = (base64Data: string, mimeType: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    const src = `data:${mimeType};base64,${base64Data}`;
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(src);
          return;
        }
        
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        
        // Watermark Configuration
        const text = "EMOTIVE";
        
        // Calculate responsive font size (reduced to approx 8% of image width)
        const fontSize = Math.floor(img.width * 0.08);
        
        // Use a heavy, bold sans-serif font to match the branding
        ctx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Position: Centered horizontally, near the bottom
        const x = canvas.width / 2;
        const y = canvas.height - (fontSize * 2);
        
        // "Embedded" effect using Composite Operations
        
        // Layer 1: Overlay blend mode
        // This lightens the underlying texture, making the text look like light reflection on the fluid
        ctx.save();
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; 
        ctx.fillText(text, x, y);
        ctx.restore();
        
        // Layer 2: Soft normal fill for legibility
        // Ensures readability if the background is too bright for 'overlay' to work alone
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'; 
        
        // Add a soft shadow to lift it slightly from the texture
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(text, x, y);
        ctx.restore();

        resolve(canvas.toDataURL(mimeType));
      } catch (e) {
        console.error("Watermarking failed:", e);
        resolve(src);
      }
    };
    
    img.onerror = () => resolve(src);
    img.src = src;
  });
};

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
          const mimeType = part.inlineData.mimeType || 'image/png';
          
          // Apply watermark before returning
          const imageUrl = await addWatermark(base64EncodeString, mimeType);
          
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