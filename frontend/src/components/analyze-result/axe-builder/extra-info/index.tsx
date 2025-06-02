'use client';

import HeadingStructure from './HeadingStructure';
import TabNavigationOrder from './TabNavigationOrder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ExtraInfo() {
    return (
        <Tabs defaultValue="headingStructure">
            <TabsList className="w-auto rounded-none">
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
    );
}
