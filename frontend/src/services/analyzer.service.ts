/* eslint-disable @typescript-eslint/no-unused-vars */
import 'server-only';
import { env } from './env.service';
import { Status } from '@/enums';
import { stringifyObjectValues } from '@/lib/utils';
import type { AnalyzeFormData, AnalyzeResult, AskPayload, AskResult } from '@/types';

class Analyzer {
    private readonly apiUrl = env.apiUrl;

    constructor() {}

    analyze = async (params: AnalyzeFormData): AnalyzeResult => {
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
                    status: Status.Err,
                    err: error,
                };
            }

            return (await res.json()) as AnalyzeResult;
        } catch (error) {
            return {
                status: Status.Err,
                err: 'Something went wrong..!',
            };
        }
    };

    assistant = async (payload: AskPayload): AskResult => {
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
                    status: Status.Err,
                    err: error,
                };
            }

            return (await res.json()) as AskResult;
        } catch (error) {
            return {
                status: Status.Err,
                err: 'Something went wrong..!',
            };
        }
    };
}

const analyzer = new Analyzer();
export default analyzer;
