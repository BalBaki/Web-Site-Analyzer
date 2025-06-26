import * as z from 'zod';
import { envSchema } from '@/schemas';

export type Env = z.infer<typeof envSchema>;
