'use client';

import { useQuery } from '@tanstack/react-query';
import type { AnalyzeFormData, AnalyzeSearchParams } from '@/types';
import { stringifyObjectValues } from '@/lib/utils';
import { useEffect, type Dispatch, type SetStateAction } from 'react';

const analyzeSite = async (params: AnalyzeFormData) => {
    const res = await fetch('http://localhost:3000/analyze?' + new URLSearchParams(stringifyObjectValues(params)));

    if (!res.ok) throw new Error('Error. Status: ' + res.status);

    return res.json();
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
    if (error) return <div>Error: {error.message}</div>;

    return <div className="w-96 overflow-auto">{JSON.stringify(data)}</div>;
}
