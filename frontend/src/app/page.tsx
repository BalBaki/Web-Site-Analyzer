import Analyze from '@/components/Analyze';

type HomePageProps = {
    searchParams: Promise<{
        url: string | undefined;
        services: string[] | undefined;
    }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
    const _searchParams = await searchParams;

    return <Analyze searchParams={_searchParams} />;
}
