import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSpeedInsightTab from './PageSpeedInsightTab';
import type { PageSpeedInsightResult } from '@/types';

type PageSpeedInsightProps = {
    result: PageSpeedInsightResult;
};

export default function PageSpeedInsight({ result }: PageSpeedInsightProps) {
    return (
        <Tabs defaultValue="desktop">
            <TabsList className="grid grid-cols-2">
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="desktop">
                <PageSpeedInsightTab data={result.desktop} />
            </TabsContent>
            <TabsContent value="mobile">
                <PageSpeedInsightTab data={result.mobile} />
            </TabsContent>
        </Tabs>
    );

    // return <div>{result.desktop.lighthouseResult?.audits?.['document-title'].description}</div>;
}
