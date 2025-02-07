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
});

export const analyzeFormSchema = z.object({
    url: z.string().url('Enter Valid Url'),
    services: z
        .array(z.enum(['axebuilder', 'pagespeedinsight', 'whois']))
        .transform((val) => [...new Set(val)])
        .refine((val) => val.length > 0, 'Select at least one service!'),
});
