import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';
import { EnvService } from './services/env/env.service';
import { ConfigModule } from '@nestjs/config';
import { PageSpeedInsightService } from './services/page-speed-insight/page-speed-insight.service';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 1000, //60 seconds as miliseconds
                limit: 10,
            },
        ]),
        ConfigModule.forRoot({
            envFilePath: '.env',
            isGlobal: true,
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
    ],
})
export class AppModule {}
