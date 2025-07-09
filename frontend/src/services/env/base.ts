import * as z from 'zod';

export abstract class BaseEnvService<T extends Record<string, string>> {
    protected env: Readonly<T>;

    protected constructor(
        private schema: z.ZodSchema,
        payload?: Record<keyof T, unknown>,
    ) {
        try {
            if (!this.isServer && !payload)
                throw new Error('Client-side environment requires payload. Please provide environment variables.');

            this.env = Object.freeze(this.schema.parse(this.isServer ? process.env : payload));
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

    get<K extends keyof T>(key: K): T[K] {
        return this.env[key];
    }

    get all(): Readonly<T> {
        return this.env;
    }
    get isServer() {
        return typeof window === 'undefined';
    }
}
