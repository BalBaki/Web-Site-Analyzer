import * as z from 'zod';

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
    deepscan: z.preprocess((val) => (val === 'true' ? true : false), z.boolean()),
});

export const analyzeFormSchema = z.object({
    url: z.string().url('Enter Valid Url'),
    services: z
        .array(z.enum(['axebuilder', 'pagespeedinsight', 'whois']))
        .min(1, 'Select at least one service!')
        .transform((val) => [...new Set(val)]),
    deepscan: z.boolean().default(false),
});

export const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z
        .string()
        .url()
        .transform((value) => (value.endsWith('/') ? value : `${value}/`)),
});
