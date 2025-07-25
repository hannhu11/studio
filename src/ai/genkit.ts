'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// This is the correct configuration.
// It does not require manually passing the API key here.
// Genkit will automatically use the application's default credentials
// when deployed on Google Cloud or a Vercel environment connected to a Google Cloud project.
export const ai = genkit({
  plugins: [googleAI()],
});
