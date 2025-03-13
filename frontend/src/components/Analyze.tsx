import AnalyzeResult from './analyze-result';
import { analyzeSearchParamsSchema } from '@/schemas';

type AnalyzeProps = {
    searchParams: {
        url: string | undefined;
        services: string[] | undefined;
    };
};

export default function Analyze({ searchParams }: AnalyzeProps) {
    const validatedSearchParams = analyzeSearchParamsSchema.safeParse(searchParams);

    return (
        <section aria-label="Analyze Result">
            {validatedSearchParams.success && <AnalyzeResult searchParams={validatedSearchParams.data} />}
        </section>
    );
}
