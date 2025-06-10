import { Status } from '@/enums';
import type { AskPayload, AskResult } from '@/types';

class ApiService {
    private readonly baseApiUrl = 'api';

    ask = async (payload: AskPayload): AskResult => {
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

const apiService = new ApiService();

export default apiService;
