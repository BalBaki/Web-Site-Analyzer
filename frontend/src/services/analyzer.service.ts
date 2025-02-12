import { stringifyObjectValues } from '@/lib/utils';
import type { AnalyzeFormData, AnalyzeResult } from '@/types';

class Analyzer {
    private apiUrl: string;

    constructor() {
        if (!process.env.NEXT_PUBLIC_API_URL) throw new Error('Missing Backend Api Url..!');

        this.apiUrl = process.env.NEXT_PUBLIC_API_URL;
    }

    analyze = async (params: AnalyzeFormData): Promise<AnalyzeResult> => {
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

            return { analyze: false, error };
        }

        const result = await res.json();

        return result as AnalyzeResult;
    };
}

const analyzer = new Analyzer();
export default analyzer;
