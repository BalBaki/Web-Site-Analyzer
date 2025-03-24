import * as z from 'zod';

export const envSchema = z.object({
    PAGE_SPEED_INSIGHT_API_KEY: z.string().min(1),
    WHO_IS_API_KEY: z.string().min(1),
    CHATGPT_API_KEY: z.string().min(1),
});

export const analyzeSchema = z.object({
    url: z.string().url(),
    services: z
        .string()
        .transform((val) => {
            return JSON.parse(val);
        })
        .pipe(z.array(z.enum(['axebuilder', 'pagespeedinsight', 'whois'])))
        .transform((val) => [...new Set(val)]),
    deepscan: z.preprocess((val) => (val === 'true' ? true : false), z.boolean()),
});

export const assistantSchema = z.object({
    type: z.enum(['acccessbility', 'normal']).default('normal'),
    description: z.string().min(1),
    elementHtml: z.string().optional(),
});
