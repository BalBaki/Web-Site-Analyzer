import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AxeBuilderService } from './services/axe-builder/axe-builder.service';

@Module({
    imports: [
        ThrottlerModule.forRoot([
            {
                ttl: 60 * 1000, //60 seconds as miliseconds
                limit: 10,
            },
        ]),
    ],
    controllers: [AppController],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        AppService,
        AxeBuilderService,
    ],
})
export class AppModule {}
