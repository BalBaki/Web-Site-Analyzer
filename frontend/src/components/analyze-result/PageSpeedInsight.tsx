import PageSpeedInsightTab from './PageSpeedInsightTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PageSpeedInsightResponse } from '@/types';

type PageSpeedInsightProps = {
    analyzeResult: PageSpeedInsightResponse;
};

export default function PageSpeedInsight({ analyzeResult }: PageSpeedInsightProps) {
    if ('error' in analyzeResult) return <div>Error at Page Speed Insight</div>;
    return (
        <Tabs defaultValue="desktop">
            <TabsList className="grid grid-cols-2">
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="desktop">
                <PageSpeedInsightTab data={analyzeResult.desktop} />
            </TabsContent>
            <TabsContent value="mobile">
                <PageSpeedInsightTab data={analyzeResult.mobile} />
            </TabsContent>
        </Tabs>
    );

    // return <div>{result.desktop.lighthouseResult?.audits?.['document-title'].description}</div>;
}
