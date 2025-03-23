import * as z from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

class EnvService {
    private static instance: EnvService;
    private env: Env;

    private constructor() {
        try {
            this.env = envSchema.parse({
                NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const missingVars = error.issues.map((issue) => issue.path.join('.'));

                throw new Error(
                    `Invalid environment variables: ${missingVars.join(', ')}\n` +
                        'Please check your .env file and make sure all required variables are set correctly.',
                );
            }

            throw error;
        }
    }

    static getInstance() {
        if (!EnvService.instance) EnvService.instance = new EnvService();

        return EnvService.instance;
    }

    get<T extends keyof Env>(key: T): Env[T] {
        return this.env[key];
    }

    get apiUrl() {
        return this.get('NEXT_PUBLIC_API_URL');
    }
}

export const env = EnvService.getInstance();
