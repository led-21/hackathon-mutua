'use server';
/**
 * @fileOverview A flow to translate and summarize wildfire risk reports for NGO workers.
 *
 * - translateAndSummarizeWildfireReport - A function that handles the translation and summarization process.
 * - TranslateAndSummarizeWildfireReportInput - The input type for the translateAndSummarizeWildfireReport function.
 * - TranslateAndSummarizeWildfireReportOutput - The return type for the translateAndSummarizeWildfireReport function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {translateText} from '@/services/lilt';

const TranslateAndSummarizeWildfireReportInputSchema = z.object({
  report: z.string().describe('The wildfire risk report to translate and summarize.'),
  targetLanguage: z.string().describe('The ISO 639-1 language code of the target language (e.g., \'es\' for Spanish).'),
});
export type TranslateAndSummarizeWildfireReportInput = z.infer<typeof TranslateAndSummarizeWildfireReportInputSchema>;

const TranslateAndSummarizeWildfireReportOutputSchema = z.object({
  translatedSummary: z.string().describe('The translated and summarized wildfire risk report.'),
});
export type TranslateAndSummarizeWildfireReportOutput = z.infer<typeof TranslateAndSummarizeWildfireReportOutputSchema>;

export async function translateAndSummarizeWildfireReport(
  input: TranslateAndSummarizeWildfireReportInput
): Promise<TranslateAndSummarizeWildfireReportOutput> {
  return translateAndSummarizeWildfireReportFlow(input);
}

const summarizeReportPrompt = ai.definePrompt({
  name: 'summarizeReportPrompt',
  input: {
    schema: z.object({
      report: z.string().describe('The wildfire risk report to summarize.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the wildfire risk report.'),
    }),
  },
  prompt: `Summarize the following wildfire risk report, focusing on key information for NGO workers:

  Report: {{{report}}}`,
});

const translateAndSummarizeWildfireReportFlow = ai.defineFlow<
  typeof TranslateAndSummarizeWildfireReportInputSchema,
  typeof TranslateAndSummarizeWildfireReportOutputSchema
>(
  {
    name: 'translateAndSummarizeWildfireReportFlow',
    inputSchema: TranslateAndSummarizeWildfireReportInputSchema,
    outputSchema: TranslateAndSummarizeWildfireReportOutputSchema,
  },
  async input => {
    const translatedReport = await translateText(input.report, input.targetLanguage);
    const {output} = await summarizeReportPrompt({report: translatedReport});
    return {translatedSummary: output!.summary};
  }
);
