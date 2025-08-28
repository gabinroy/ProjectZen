'use server';
/**
 * @fileOverview An AI agent that summarizes task comments.
 *
 * - summarizeTaskComments - A function that summarizes the comments of a task.
 * - SummarizeTaskCommentsInput - The input type for the summarizeTaskComments function.
 * - SummarizeTaskCommentsOutput - The return type for the summarizeTaskComments function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTaskCommentsInputSchema = z.object({
  comments: z
    .string()
    .describe('The comments to summarize.'),
});
export type SummarizeTaskCommentsInput = z.infer<typeof SummarizeTaskCommentsInputSchema>;

const SummarizeTaskCommentsOutputSchema = z.object({
  summary: z.string().describe('A summary of the comments.'),
});
export type SummarizeTaskCommentsOutput = z.infer<typeof SummarizeTaskCommentsOutputSchema>;

export async function summarizeTaskComments(input: SummarizeTaskCommentsInput): Promise<SummarizeTaskCommentsOutput> {
  return summarizeTaskCommentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTaskCommentsPrompt',
  input: {schema: SummarizeTaskCommentsInputSchema},
  output: {schema: SummarizeTaskCommentsOutputSchema},
  prompt: `You are an expert project manager specializing in summarizing task comments.

You will use this information to summarize the task comments, and identify any action items.

Comments: {{{comments}}}`,
});

const summarizeTaskCommentsFlow = ai.defineFlow(
  {
    name: 'summarizeTaskCommentsFlow',
    inputSchema: SummarizeTaskCommentsInputSchema,
    outputSchema: SummarizeTaskCommentsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
