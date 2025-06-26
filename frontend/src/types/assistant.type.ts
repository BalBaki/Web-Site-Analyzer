import * as z from 'zod';
import { askSchema } from '@/schemas';
import type { AsyncResult, BaseError } from './common.type';

export type AskPayload = z.infer<typeof askSchema>;

export type Ask = {
    answer: string;
};

export type AskError = BaseError;
export type AskResult = AsyncResult<Ask, AskError>;
