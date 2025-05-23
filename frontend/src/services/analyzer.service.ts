/* eslint-disable @typescript-eslint/no-unused-vars */
import 'server-only';
import { env } from './env.service';
import { stringifyObjectValues } from '@/lib/utils';
import type { AnalyzeFormData, AnalyzeResult, AssistantPayload, AssistantResponse } from '@/types';

class Analyzer {
    private readonly apiUrl = env.apiUrl;

    constructor() {}

    analyze = async (params: AnalyzeFormData): Promise<AnalyzeResult> => {
        try {
            const res = await fetch(this.apiUrl + 'analyze?' + new URLSearchParams(stringifyObjectValues(params)));

            if (!res.ok) {
                let error: string;

                switch (res.status) {
                    case 402:
                        error = 'Enter valid data..!';
                        break;

                    case 429:
                        error = 'Too many request. Try a few minute later..!';
                        break;

                    default:
                        error = 'Something went wrong..!';
                        break;
                }

                return {
                    analyze: false,
                    error,
                };
            }

            const result = await res.json();

            return result as AnalyzeResult;
        } catch (error) {
            return {
                analyze: false,
                error: 'Something went wrong..!',
            };
        }
    };

    assistant = async (payload: AssistantPayload): Promise<AssistantResponse> => {
        try {
            const res = await fetch(this.apiUrl + 'assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                let error: string;

                switch (res.status) {
                    case 402:
                        error = 'Enter valid data..!';
                        break;
                    default:
                        error = 'Something went wrong..!';
                        break;
                }

                return {
                    assistant: false,
                    error,
                };
            }

            const result = await res.json();

            return result as AssistantResponse;
        } catch (error) {
            return {
                assistant: false,
                error: 'Something went wrong..!',
            };
        }
    };
}

const analyzer = new Analyzer();
export default analyzer;
