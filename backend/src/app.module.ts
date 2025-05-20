import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import * as z from 'zod';
import { envSchema } from './schemas';
import { AnalyzeModule } from './modules/analyze/analyze.module';
import { AssistantModule } from './modules/assistant/assistant.module';
import { EnvModule } from './modules/env/env.module';

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
        AnalyzeModule,
        AssistantModule,
        EnvModule,
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        AppService,
    ],
})
export class AppModule {}
