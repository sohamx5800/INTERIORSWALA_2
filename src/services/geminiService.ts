import { GoogleGenAI, Type } from "@google/genai";
import { ProjectConcept } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateInteriorConcept(prompt: string): Promise<ProjectConcept> {
  const model = "gemini-3-flash-preview";
  
  const response = await ai.models.generateContent({
    model,
    contents: `Act as a luxury interior designer for Interiorswala. Generate a detailed interior design concept based on this request: "${prompt}". 
    The response must be in JSON format. Ensure the colorPalette contains valid CSS hex color codes.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING },
          colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
          materials: { type: Type.ARRAY, items: { type: Type.STRING } },
          description: { type: Type.STRING },
          designPlan: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A step-by-step design execution plan" },
        },
        required: ["theme", "colorPalette", "keyFeatures", "materials", "description", "designPlan"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
