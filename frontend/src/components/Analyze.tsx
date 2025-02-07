'use client';

import { useState } from 'react';
import AnalyzeForm from './AnalyzeForm';
import AnalyzeResult from './AnalyzeResult';
import { analyzeSearchParamsSchema } from '@/schemas';

type AnalyzeProps = {
    searchParams: {
        url: string | undefined;
        services: string[] | undefined;
    };
};

export default function Analyze({ searchParams }: AnalyzeProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const validatedSearchParams = analyzeSearchParamsSchema.safeParse(searchParams);

    return (
        <>
            <section aria-label="Analyze Form">
                <AnalyzeForm
                    searchParams={validatedSearchParams.success ? validatedSearchParams.data : null}
                    isAnalyzing={isAnalyzing}
                />
            </section>
            <section aria-label="Analyze Result">
                {validatedSearchParams.success && (
                    <AnalyzeResult searchParams={validatedSearchParams.data} setIsAnalyzing={setIsAnalyzing} />
                )}
            </section>
        </>
    );
}
