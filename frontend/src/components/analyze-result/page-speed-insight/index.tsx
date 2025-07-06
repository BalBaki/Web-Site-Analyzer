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
            <Tabs
                defaultValue="desktop"
                className="mt-3 rounded-md border-2"
            >
                <TabsList className="mx-auto h-11 w-full [&>button]:grow-0">
                    <TabsTrigger
                        value="desktop"
                        className="sm:text-lg"
                    >
                        Desktop
                    </TabsTrigger>
                    <TabsTrigger
                        value="mobile"
                        className="sm:text-lg"
                    >
                        Mobile
                    </TabsTrigger>
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
