import { notFound } from 'next/navigation';
import AnalyzeResult from './analyze-result';
import { analyzeSearchParamsSchema } from '@/schemas';

type AnalyzeProps = {
    searchParams: {
        url: string | undefined;
        services: string[] | undefined;
        deepscan: string | undefined;
    };
};

export default function Analyze({ searchParams }: AnalyzeProps) {
    const validatedSearchParams = analyzeSearchParamsSchema.safeParse(searchParams);

    if (!validatedSearchParams.success) return notFound();

    return <AnalyzeResult searchParams={validatedSearchParams.data} />;
}
