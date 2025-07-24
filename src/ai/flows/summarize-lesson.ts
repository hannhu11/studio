'use server';

/**
 * @fileOverview AI-powered lesson summarization flow.
 *
 * - summarizeLesson - A function that accepts lesson content and returns a summarized version.
 * - SummarizeLessonInput - The input type for the summarizeLesson function.
 * - SummarizeLessonOutput - The return type for the summarizeLesson function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLessonInputSchema = z.object({
  lessonContent: z
    .string()
    .describe('The content of the lesson to be summarized.'),
});
export type SummarizeLessonInput = z.infer<typeof SummarizeLessonInputSchema>;

const SummarizeLessonOutputSchema = z.object({
  summary: z.string().describe('A summarized version of the lesson content.'),
});
export type SummarizeLessonOutput = z.infer<typeof SummarizeLessonOutputSchema>;

export async function summarizeLesson(input: SummarizeLessonInput): Promise<SummarizeLessonOutput> {
  return summarizeLessonFlow(input);
}

const summarizeLessonPrompt = ai.definePrompt({
  name: 'summarizeLessonPrompt',
  input: {schema: SummarizeLessonInputSchema},
  output: {schema: SummarizeLessonOutputSchema},
  prompt: `Summarize the following lesson content, extracting the key concepts and main ideas:\n\n{{{lessonContent}}}`,
});

const summarizeLessonFlow = ai.defineFlow(
  {
    name: 'summarizeLessonFlow',
    inputSchema: SummarizeLessonInputSchema,
    outputSchema: SummarizeLessonOutputSchema,
  },
  async input => {
    const {output} = await summarizeLessonPrompt(input);
    return output!;
  }
);
