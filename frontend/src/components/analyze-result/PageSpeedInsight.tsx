'use client';

import PageSpeedInsightTab from './PageSpeedInsightTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { transformPageSpeedData } from '@/lib/utils';
import type { PageSpeedInsightResponse } from '@/types';

type PageSpeedInsightProps = {
    analyzeResult: PageSpeedInsightResponse;
};

export default function PageSpeedInsight({ analyzeResult }: PageSpeedInsightProps) {
    if ('error' in analyzeResult) return <div>Error at Page Speed Insight</div>;

    const transformedData = transformPageSpeedData(analyzeResult);

    return (
        <Tabs defaultValue="desktop">
            <TabsList className="grid grid-cols-2">
                <TabsTrigger value="desktop">Desktop</TabsTrigger>
                <TabsTrigger value="mobile">Mobile</TabsTrigger>
            </TabsList>
            <TabsContent value="desktop">
                <PageSpeedInsightTab
                    key="desktop"
                    data={transformedData.desktop}
                />
            </TabsContent>
            <TabsContent value="mobile">
                <PageSpeedInsightTab
                    key="mobile"
                    data={transformedData.mobile}
                />
            </TabsContent>
        </Tabs>
    );
}
