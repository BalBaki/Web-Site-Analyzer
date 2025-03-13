import Analyze from '@/components/Analyze';

type AnalysisPageProps = {
    searchParams: Promise<{
        url: string | undefined;
        services: string[] | undefined;
    }>;
};

export default async function AnalysisPage({ searchParams }: AnalysisPageProps) {
    const _searchParams = await searchParams;

    return <Analyze searchParams={_searchParams} />;
}
