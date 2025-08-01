// src/ai/flows/generate-images-for-funnel.ts
'use server';

/**
 * @fileOverview Generates images for the chat funnel based on given prompts.
 *
 * - generateImages - A function to generate images based on prompts.
 * - GenerateImagesInput - The input type for the generateImages function.
 * - GenerateImagesOutput - The return type for the generateImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImagesInputSchema = z.object({
  prompt1: z.string().describe('Prompt for the first image.'),
  prompt2: z.string().describe('Prompt for the second image.'),
});
export type GenerateImagesInput = z.infer<typeof GenerateImagesInputSchema>;

const GenerateImagesOutputSchema = z.object({
  image1DataUri: z
    .string()
    .describe(
      "The first generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  image2DataUri: z
    .string()
    .describe(
      "The second generated image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImagesOutput = z.infer<typeof GenerateImagesOutputSchema>;

export async function generateImages(input: GenerateImagesInput): Promise<GenerateImagesOutput> {
  return generateImagesFlow(input);
}

const generateImagesFlow = ai.defineFlow(
  {
    name: 'generateImagesFlow',
    inputSchema: GenerateImagesInputSchema,
    outputSchema: GenerateImagesOutputSchema,
  },
  async input => {
    const [image1Result, image2Result] = await Promise.all([
      ai.generate({
        // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt1,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
      }),
      ai.generate({
        // IMPORTANT: ONLY the googleai/gemini-2.0-flash-preview-image-generation model is able to generate images. You MUST use exactly this model to generate images.
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: input.prompt2,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // MUST provide both TEXT and IMAGE, IMAGE only won't work
        },
      }),
    ]);

    return {
      image1DataUri: image1Result.media!.url,
      image2DataUri: image2Result.media!.url,
    };
  }
);
