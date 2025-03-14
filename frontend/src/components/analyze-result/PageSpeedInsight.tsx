import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
            <TabsContent value="desktop">Desktop Result</TabsContent>
            <TabsContent value="mobile">Mobile Resukt</TabsContent>
        </Tabs>
    );

    // return <div>{result.desktop.lighthouseResult?.audits?.['document-title'].description}</div>;
}
