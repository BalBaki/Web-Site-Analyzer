import * as z from 'zod';

export const envSchema = z.object({
    PAGE_SPEED_INSIGHT_API_KEY: z.string().min(1),
    WHO_IS_API_KEY: z.string().min(1),
    CHATGPT_API_KEY: z.string().min(1),
});

export const analyzeSchema = z.object({
    url: z
        .string()
        .url()
        .transform((value) => {
            const url = new URL(value);

            if (!url.hostname.startsWith('www.')) url.hostname = 'www.' + url.hostname;

            return url.href;
        }),
    services: z
        .string()
        .transform((val) => {
            return JSON.parse(val);
        })
        .pipe(z.array(z.enum(['axebuilder', 'pagespeedinsight', 'whois'])))
        .transform((val) => [...new Set(val)]),
    deepscan: z.preprocess((val) => val === 'true', z.boolean()),
});

export const assistantSchema = z.object({
    type: z.enum(['acccessbility', 'performance', 'seo', 'best-practice', 'normal']).default('normal'),
    tool: z.enum(['chatgpt']).default('chatgpt'),
    description: z.string().min(1),
    elementHtml: z.string().optional(),
});
