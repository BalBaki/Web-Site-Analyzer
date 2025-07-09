import * as z from 'zod';
import { clientEnvSchema, serverEnvSchema } from '@/schemas';

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
