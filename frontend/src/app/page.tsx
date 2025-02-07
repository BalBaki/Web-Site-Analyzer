import Analyze from '@/components/Analyze';

type AnalyzeProps = {
    searchParams: Promise<{
        url: string | undefined;
        services: string[] | undefined;
    }>;
};

export default async function HomePage({ searchParams }: AnalyzeProps) {
    const _searchParams = await searchParams;

    return <Analyze searchParams={_searchParams} />;
}
