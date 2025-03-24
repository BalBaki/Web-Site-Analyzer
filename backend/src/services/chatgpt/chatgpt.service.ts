import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import type { AssistantPayload } from 'src/types';
import { EnvService } from '../env/env.service';

@Injectable()
export class ChatgptService {
    private client: OpenAI;
    constructor(private envService: EnvService) {
        this.client = new OpenAI({ apiKey: this.envService.chatGptApiKey });
    }

    async ask(message: string) {
        const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: `I'am taking this error:\n
                              ${message}\n
                              How can i fix it?
                    `,
                },
            ],
        });

        return completion.choices[0].message.content;
    }
}
