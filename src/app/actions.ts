"use server";

import { generateImages } from "@/ai/flows/generate-images-for-funnel";
import type { GenerateImagesOutput } from "@/ai/flows/generate-images-for-funnel";

export async function generateChatImages(): Promise<GenerateImagesOutput> {
  const prompts = {
    prompt1: "A photo of an elderly woman, smiling and confident, holding a single grain in her hand. The background is clean and natural with soft green leaves. 400x400.",
    prompt2: "A photo of an elderly woman relaxing on a beach, wearing a light beach cover-up. She is smiling, and her silhouette is visible, conveying confidence and health. 400x400.",
  };
  
  try {
    const result = await generateImages(prompts);
    return result;
  } catch (error) {
    console.error("Error generating images:", error);
    throw new Error("Failed to generate images.");
  }
}
