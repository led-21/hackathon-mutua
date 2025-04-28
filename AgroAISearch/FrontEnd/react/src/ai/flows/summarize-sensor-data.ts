'use server';
/**
 * @fileOverview Summarizes sensor data and provides AI-generated insights for farmers.
 *
 * - summarizeSensorData - A function that generates a summarized report of sensor data.
 * - SummarizeSensorDataInput - The input type for the summarizeSensorData function.
 * - SummarizeSensorDataOutput - The return type for the summarizeSensorData function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeSensorDataInputSchema = z.object({
  cropType: z.string().describe('The type of crop.'),
  soilMoisture: z.number().describe('The soil moisture level (percentage).'),
  pHLevel: z.number().describe('The pH level of the soil.'),
  ndvi: z.number().describe('The Normalized Difference Vegetation Index.'),
  temperature: z.number().describe('The ambient temperature in Celsius.'),
  location: z.string().describe('The location of the farm.'),
});
export type SummarizeSensorDataInput = z.infer<typeof SummarizeSensorDataInputSchema>;

const SummarizeSensorDataOutputSchema = z.object({
  summary: z.string().describe('A summarized report of the sensor data with AI-generated insights.'),
});
export type SummarizeSensorDataOutput = z.infer<typeof SummarizeSensorDataOutputSchema>;

export async function summarizeSensorData(input: SummarizeSensorDataInput): Promise<SummarizeSensorDataOutput> {
  return summarizeSensorDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeSensorDataPrompt',
  input: {
    schema: z.object({
      cropType: z.string().describe('The type of crop.'),
      soilMoisture: z.number().describe('The soil moisture level (percentage).'),
      pHLevel: z.number().describe('The pH level of the soil.'),
      ndvi: z.number().describe('The Normalized Difference Vegetation Index.'),
      temperature: z.number().describe('The ambient temperature in Celsius.'),
      location: z.string().describe('The location of the farm.'),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summarized report of the sensor data with AI-generated insights.'),
    }),
  },
  prompt: `You are an AI assistant providing insights to farmers.

  Based on the sensor data provided, generate a concise summary of the crop health, potential issues, and recommended actions. Include specific advice based on the data.

  Crop Type: {{{cropType}}}
  Location: {{{location}}}
  Soil Moisture: {{{soilMoisture}}}%
  pH Level: {{{pHLevel}}}
  NDVI: {{{ndvi}}}
  Temperature: {{{temperature}}}°C

  Summary:`,
});

const summarizeSensorDataFlow = ai.defineFlow<
  typeof SummarizeSensorDataInputSchema,
  typeof SummarizeSensorDataOutputSchema
>({
  name: 'summarizeSensorDataFlow',
  inputSchema: SummarizeSensorDataInputSchema,
  outputSchema: SummarizeSensorDataOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
