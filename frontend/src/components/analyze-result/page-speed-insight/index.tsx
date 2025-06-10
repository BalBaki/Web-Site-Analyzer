'use client';

import Tab from './Tab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Status } from '@/enums';
import { transformPageSpeedData } from '@/lib/utils';
import type { PageSpeedInsightResult } from '@/types';

type PageSpeedInsightProps = {
    analyzeResult: PageSpeedInsightResult;
};

export default function PageSpeedInsight({ analyzeResult }: PageSpeedInsightProps) {
    if (analyzeResult.status === Status.Err) return <div>Error at Page Speed Insight Service</div>;

    const transformedData = transformPageSpeedData(analyzeResult.data);

    return (
        <>
            <h2
                id="psi-result"
                className="sr-only"
            >
                Page Speed Insight Analyze Result
            </h2>
            <Tabs defaultValue="desktop">
                <TabsList className="w-auto">
                    <TabsTrigger value="desktop">Desktop</TabsTrigger>
                    <TabsTrigger value="mobile">Mobile</TabsTrigger>
                </TabsList>
                <TabsContent value="desktop">
                    <Tab
                        key="desktop"
                        data={transformedData.desktop}
                    />
                </TabsContent>
                <TabsContent value="mobile">
                    <Tab
                        key="mobile"
                        data={transformedData.mobile}
                    />
                </TabsContent>
            </Tabs>
        </>
    );
}
