'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useQuery } from '@tanstack/react-query';
import AxeBuilder from './AxeBuilder';
import analyzer from '@/services/analyzer.service';
import type { AnalyzeResult, AnalyzeSearchParams } from '@/types';

type AnalyzeResultProps = {
    searchParams: AnalyzeSearchParams;
    setIsAnalyzing: Dispatch<SetStateAction<boolean>>;
};

export default function AnalyzeResult({ searchParams, setIsAnalyzing }: AnalyzeResultProps) {
    const { data, isFetching, error } = useQuery({
        queryFn: () => analyzer.analyze(searchParams),
        queryKey: [searchParams],
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        setIsAnalyzing(isFetching);
    }, [isFetching, setIsAnalyzing]);

    if (isFetching) return <div>Analyzing...</div>;
    if (error) return <div>Error: {error.message || 'Something went wrong..!'}</div>;
    if (!data?.analyze) return <div>{data?.error}</div>;
    console.log(data);
    return (
        <>
            <pre className="max-w-full overflow-auto">
                {/* <code>
                {JSON.stringify(
                    Object.groupBy(data.results.axebuilder, (result) => result.id),
                    null,
                    2
                    )}
                    </code> */}
                {/* {data.results.axebuilder.reduce((total, result) => (total += result.nodes.length), 0)} */}
            </pre>

            {data.results.axebuilder && <AxeBuilder result={data.results.axebuilder} />}
        </>
    );
}
