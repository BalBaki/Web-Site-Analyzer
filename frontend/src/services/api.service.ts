import { Status } from '@/enums';
import type { AskPayload, AskResult } from '@/types';

export class ApiService {
    static readonly baseApiUrl = 'api';

    static ask = async (payload: AskPayload): AskResult => {
        const response = await fetch(`${this.baseApiUrl}/assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) return { status: Status.Err, err: 'Something went wrong..!' };

        return (await response.json()) as AskResult;
    };
}
