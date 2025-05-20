import { Injectable } from '@nestjs/common';
import { ChatgptService } from './services/chatgpt/chatgpt.service';
import { InvalidPayloadException } from 'src/exceptions/invalid-payload.exception';
import type { AssistantPayload } from 'src/types';

@Injectable()
export class AssissantService {
    constructor(private chatgptService: ChatgptService) {}

    getTool(toolName: AssistantPayload['tool']) {
        switch (toolName) {
            case 'chatgpt':
                return this.chatgptService;
            default:
                throw new InvalidPayloadException();
        }
    }
}
