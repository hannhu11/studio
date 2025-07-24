// This file implements the Genkit flow for providing AI-powered explanations for quiz answers.

'use server';

/**
 * @fileOverview A flow that provides AI-powered explanations for quiz answers.
 *
 * - explainAnswer - A function that generates explanations for quiz answers.
 * - ExplainAnswerInput - The input type for the explainAnswer function.
 * - ExplainAnswerOutput - The return type for the explainAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAnswerInputSchema = z.object({
  question: z.string().describe('The quiz question.'),
  answer: z.string().describe('The correct answer to the question.'),
  userAnswer: z.string().optional().describe('The answer chosen by the user.'),
  lessonContent: z.string().describe('Relevant lesson content for context.'),
});

export type ExplainAnswerInput = z.infer<typeof ExplainAnswerInputSchema>;

const ExplainAnswerOutputSchema = z.object({
  explanation: z.string().describe('The AI-powered explanation of the answer.'),
});

export type ExplainAnswerOutput = z.infer<typeof ExplainAnswerOutputSchema>;

export async function explainAnswer(input: ExplainAnswerInput): Promise<ExplainAnswerOutput> {
  return explainAnswerFlow(input);
}

const explainAnswerPrompt = ai.definePrompt({
  name: 'explainAnswerPrompt',
  input: {schema: ExplainAnswerInputSchema},
  output: {schema: ExplainAnswerOutputSchema},
  prompt: `You are an AI assistant whose purpose is to explain the correct answer to a quiz question.

  Here is the question:
  {{question}}

  Here is the correct answer:
  {{answer}}

  {{#if userAnswer}}
  The user chose: {{userAnswer}}
  Explain why the correct answer is better.
  {{/if}}

  Here is some lesson content that may be helpful in your explanation:
  {{lessonContent}}

  Provide a clear and concise explanation.
  `,
});

const explainAnswerFlow = ai.defineFlow(
  {
    name: 'explainAnswerFlow',
    inputSchema: ExplainAnswerInputSchema,
    outputSchema: ExplainAnswerOutputSchema,
  },
  async input => {
    const {output} = await explainAnswerPrompt(input);
    return output!;
  }
);
