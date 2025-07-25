'use server';

/**
 * @fileOverview An AI agent that generates quiz questions and answers from images.
 *
 * - generateQuestionsFromImages - A function that handles the question generation process.
 * - GenerateQuestionsFromImagesInput - The input type for the generateQuestionsFromImages function.
 * - GenerateQuestionsFromImagesOutput - The return type for the generateQuestionsFromImages function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuestionsFromImagesInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image containing quiz questions, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateQuestionsFromImagesInput = z.infer<
  typeof GenerateQuestionsFromImagesInputSchema
>;

const GenerateQuestionsFromImagesOutputSchema = z.object({
  questions: z
    .array(
      z.object({
        questionText: z.string().describe('The text of the question.'),
        answers: z.array(z.string()).describe('The possible answers to the question.'),
        correctAnswerIndex: z
          .number()
          .describe('The index of the correct answer in the answers array.'),
      })
    )
    .describe('The generated quiz questions.'),
});

export type GenerateQuestionsFromImagesOutput = z.infer<
  typeof GenerateQuestionsFromImagesOutputSchema
>;

export async function generateQuestionsFromImages(
  input: GenerateQuestionsFromImagesInput
): Promise<GenerateQuestionsFromImagesOutput> {
  return generateQuestionsFromImagesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuestionsFromImagesPrompt',
  input: {schema: GenerateQuestionsFromImagesInputSchema},
  output: {schema: GenerateQuestionsFromImagesOutputSchema},
  // Explicitly use the vision-capable model here.
  model: 'googleai/gemini-2.0-flash',
  prompt: `You are an AI quiz generator. You will receive an image containing quiz questions. Extract the questions, possible answers, and identify the correct answer index.

Image: {{media url=imageDataUri}}

Output the questions in JSON format.`,
});

const generateQuestionsFromImagesFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFromImagesFlow',
    inputSchema: GenerateQuestionsFromImagesInputSchema,
    outputSchema: GenerateQuestionsFromImagesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
