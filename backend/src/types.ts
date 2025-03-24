import * as z from 'zod';
import { analyzeSchema, assistantSchema } from './schemas';

export type AnalyzePayload = z.infer<typeof analyzeSchema>;
export type AssistantPayload = z.infer<typeof assistantSchema>;
