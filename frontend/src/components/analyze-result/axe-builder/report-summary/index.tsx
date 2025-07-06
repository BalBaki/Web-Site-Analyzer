'use client';

import HeadingStructure from './HeadingStructure';
import TabNavigationOrder from './TabNavigationOrder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ReportSummary() {
    return (
        <section aria-describedby="report-summary">
            <h3
                id="report-summary"
                className="sr-only"
            >
                Report Summary
            </h3>
            <Tabs defaultValue="headingStructure">
                <TabsList className="h-10 w-auto rounded-none">
                    <TabsTrigger
                        value="headingStructure"
                        className="h-full p-0"
                    >
                        Heading Structure
                    </TabsTrigger>
                    <TabsTrigger
                        value="tabNavigationOrder"
                        className="h-full p-0"
                    >
                        Tab Navigation Order
                    </TabsTrigger>
                </TabsList>
                <div className="h-96 overflow-auto">
                    <TabsContent value="headingStructure">
                        <HeadingStructure />
                    </TabsContent>
                    <TabsContent value="tabNavigationOrder">
                        <TabNavigationOrder />
                    </TabsContent>
                </div>
            </Tabs>
        </section>
    );
}
