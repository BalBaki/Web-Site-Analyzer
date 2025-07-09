import { BaseEnvService } from './base';
import { clientEnvSchema } from '@/schemas';
import type { ClientEnv } from '@/types';

export class ClientEnvService extends BaseEnvService<ClientEnv> {
    private static instance: ClientEnvService;

    private constructor() {
        super(clientEnvSchema, { NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL });
    }

    static getInstance() {
        if (!ClientEnvService.instance) ClientEnvService.instance = new ClientEnvService();

        return ClientEnvService.instance;
    }

    get apiUrl() {
        return this.get('NEXT_PUBLIC_API_URL');
    }
}

export const clientEnv = ClientEnvService.getInstance();
