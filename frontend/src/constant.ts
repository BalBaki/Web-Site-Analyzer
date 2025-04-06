import * as z from 'zod';
import { DataTypeWithSchema, PageSpeedInsightStatusPriorty } from '@/types';

export const PAGE_SPEED_INSIGHT_STATUS_PRIORTY: PageSpeedInsightStatusPriorty = {
    fail: 3,
    average: 2,
    pass: 1,
};

export const DATA_TYPES_WITH_SCHEMAS: DataTypeWithSchema[] = [
    {
        type: 'null',
        schema: z.null(),
    },
    {
        type: 'undefined',
        schema: z.undefined(),
    },
    {
        type: 'string',
        schema: z.string(),
    },
    {
        type: 'number',
        schema: z.number(),
    },
    {
        type: 'boolean',
        schema: z.boolean(),
    },
    {
        type: 'date',
        schema: z.date(),
    },
    {
        type: 'array',
        schema: z.array(z.any()),
    },
    {
        type: 'object',
        schema: z.record(z.any()),
    },
];
