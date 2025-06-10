import * as z from 'zod';
import { DEFAULT_LOCAL_URL } from './constants';

export const analyzeSearchParamsSchema = z.object({
    url: z.string().url(),
    services: z
        .string()
        .transform((val) => {
            try {
                return JSON.parse(val);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                return z.NEVER;
            }
        })
        .pipe(z.array(z.enum(['axebuilder', 'pagespeedinsight', 'whois'])))
        .transform((val) => [...new Set(val)]),
    deepscan: z.preprocess((val) => val === 'true', z.boolean()),
});

export const analyzeFormSchema = z.object({
    url: z.string().url('Enter Valid Url'),
    services: z
        .array(z.enum(['axebuilder', 'pagespeedinsight', 'whois']))
        .min(1, 'Select at least one service!')
        .transform((val) => [...new Set(val)]),
    deepscan: z.boolean().default(false),
});

export const envSchema = z
    .object({
        API_URL: z
            .string()
            .url()
            .transform((value) => (value.endsWith('/') ? value : `${value}/`)),
        NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),
        SITE_URL: z
            .string()
            .url()
            .optional()
            .default(DEFAULT_LOCAL_URL)
            .transform((value) => (value.endsWith('/') ? value : `${value}/`)),
    })
    .refine(
        ({ NODE_ENV, SITE_URL }) => {
            if (NODE_ENV === 'production') return SITE_URL !== DEFAULT_LOCAL_URL;

            return true;
        },
        {
            message: 'A valid SITE_URL must be provided in production environment',
            path: ['SITE_URL'],
        },
    );

export const askSchema = z.object({
    type: z.enum(['acccessbility', 'performance', 'seo', 'best-practice', 'normal']).default('normal'),
    tool: z.enum(['chatgpt']).default('chatgpt'),
    description: z.string().min(1),
    elementHtml: z.string().optional(),
});
