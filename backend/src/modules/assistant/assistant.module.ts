import { Module } from '@nestjs/common';
import { ChatgptService } from './services/chatgpt/chatgpt.service';
import { AssissantService } from './assistant.service';
import { EnvModule } from '../env/env.module';

@Module({ providers: [ChatgptService, AssissantService], exports: [AssissantService], imports: [EnvModule] })
export class AssistantModule {}
