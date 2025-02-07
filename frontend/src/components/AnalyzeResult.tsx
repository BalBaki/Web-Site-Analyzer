'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import { stringifyObjectValues } from '@/lib/utils';
import type { AnalyzeFormData, AnalyzeResult, AnalyzeSearchParams } from '@/types';

const analyzeSite = async (params: AnalyzeFormData): Promise<AnalyzeResult> => {
    const res = await fetch('http://localhost:3000/analyze?' + new URLSearchParams(stringifyObjectValues(params)));

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

type AnalyzeResultProps = {
    searchParams: AnalyzeSearchParams;
    setIsAnalyzing: Dispatch<SetStateAction<boolean>>;
};

export default function AnalyzeResult({ searchParams, setIsAnalyzing }: AnalyzeResultProps) {
    const { data, isFetching, error } = useQuery({
        queryFn: () => analyzeSite(searchParams),
        queryKey: [searchParams],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setIsAnalyzing(isFetching);
    }, [isFetching, setIsAnalyzing]);

    if (isFetching) return <div>Analyzing...</div>;
    if (error) return <div>Error: {error?.message || 'Something went wrong..!'}</div>;
    if (data && !data.analyze) return <div>{data?.error}</div>;

    return <div className="w-96 overflow-auto">{JSON.stringify(data)}</div>;
}
