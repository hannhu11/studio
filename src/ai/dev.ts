import { config } from 'dotenv';
config();

import '@/ai/flows/explain-answer.ts';
import '@/ai/flows/summarize-lesson.ts';
import '@/ai/flows/generate-questions-from-images.ts';