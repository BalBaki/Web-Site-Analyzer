import { Injectable } from '@nestjs/common';
import { ChatgptService } from './services/chatgpt/chatgpt.service';
import { InvalidPayloadException } from 'src/exceptions/invalid-payload.exception';
import type { Tool } from 'src/types';

@Injectable()
export class AssissantService {
    constructor(private chatgptService: ChatgptService) {}

    getTool(tool: Tool) {
        switch (tool) {
            case 'chatgpt':
                return this.chatgptService;
            default:
                throw new InvalidPayloadException();
        }
    }
}
