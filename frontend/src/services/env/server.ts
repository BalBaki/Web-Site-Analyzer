import 'server-only';
import { BaseEnvService } from './base';
import { DEFAULT_LOCAL_URL } from '@/constants';
import { serverEnvSchema } from '@/schemas';
import type { ServerEnv } from '@/types';

class ServerEnvService extends BaseEnvService<ServerEnv> {
    private static instance: ServerEnvService;

    private constructor() {
        super(serverEnvSchema);
    }

    static getInstance() {
        if (!ServerEnvService.instance) ServerEnvService.instance = new ServerEnvService();

        return ServerEnvService.instance;
    }

    get isDevelopment() {
        return this.get('NODE_ENV') === 'development';
    }

    get isProduction() {
        return this.get('NODE_ENV') === 'production';
    }

    get isTest() {
        return this.get('NODE_ENV') === 'test';
    }

    get siteURL() {
        return this.isProduction ? this.get('SITE_URL') : DEFAULT_LOCAL_URL;
    }
}

export const env = ServerEnvService.getInstance();
