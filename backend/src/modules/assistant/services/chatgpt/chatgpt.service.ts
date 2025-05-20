import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { EnvService } from 'src/modules/env/env.service';
import type { AssistantPayload } from 'src/types';
import { AssissantTool } from '../../assistant-tool.interface';

@Injectable()
export class ChatgptService implements AssissantTool {
    private client: OpenAI;
    constructor(private envService: EnvService) {
        this.client = new OpenAI({ apiKey: this.envService.chatGptApiKey });
    }

    async ask({ type, elementHtml, description }: AssistantPayload) {
        let question: string;

        switch (type) {
            case 'acccessbility':
                question = `I'am taking this error: ${description} at this element html:${elementHtml}\n                              
                How can i fix it?`;

                break;

            case 'normal':
            default:
                question = `I'am taking this error ${description}\n                              
                How can i fix it?`;

                break;
        }

        const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'user',
                    content: question,
                },
            ],
        });

        return completion.choices[0].message.content;
    }
}
