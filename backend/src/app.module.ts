import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import { EnvService } from './services/env/env.service';
import { ConfigModule } from '@nestjs/config';
import { PageSpeedInsightService } from './services/page-speed-insight/page-speed-insight.service';
import { WhoIsService } from './services/who-is/who-is.service';
import * as z from 'zod';
import { envSchema } from './schemas';
import { ChatgptService } from './services/chatgpt/chatgpt.service';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 1000, //60 seconds as miliseconds
                limit: 100,
            },
        ]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
            validate(config) {
                try {
                    return envSchema.parse(config);
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
            },
        }),
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        AppService,
        EnvService,
        AxeBuilderService,
        PageSpeedInsightService,
        WhoIsService,
        ChatgptService,
    ],
})
export class AppModule {}
