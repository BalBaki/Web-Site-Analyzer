'use client';

import AxeBuilder from './axe-builder';
import PageSpeedInsight from './page-speed-insight';
import WhoIs from './WhoIs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAnalysisStream } from '@/hooks/use-analysis-stream.hook';
import type { AnalyzeResult, AnalyzeSearchParams } from '@/types';

type AnalyzeResultProps = {
    searchParams: AnalyzeSearchParams;
};

interface Service {
    name: string;
    icon: React.ReactNode;
}

const serviceInfo: Record<string, Service> = {
    axebuilder: {
        name: 'Axe Builder',
        icon: '🛠️',
    },
    pagespeedinsight: {
        name: 'Page Speed Insight',
        icon: '⚡',
    },
    whois: {
        name: 'Who Is',
        icon: '🔍',
    },
};

export default function AnalyzeResult({ searchParams }: AnalyzeResultProps) {
    const { events: streamEvents, result: analyzeResult, isLoading, error } = useAnalysisStream(searchParams);

    if (error) return <div>Something went wrong..!</div>;

    if (isLoading) {
        return (
            <div className="container mx-auto mb-1 rounded-lg border-2 p-2">
                {streamEvents.map((streamEvent, index) => {
                    if (streamEvent.event === 'error')
                        return (
                            <div
                                key={index}
                                className="capitalize"
                            >
                                {streamEvent.message}
                            </div>
                        );

                    return (
                        <p
                            key={index}
                            className="break-all"
                        >{`${(streamEvent.service, streamEvent.message)}`}</p>
                    );
                })}
            </div>
        );
    }

    return (
        analyzeResult && (
            <Tabs defaultValue={Object.keys(analyzeResult)[0]}>
                <TabsList className="mx-auto h-11 w-full justify-normal max-sm:h-auto max-sm:flex-col max-sm:gap-y-3 max-sm:pt-2 max-sm:[&>button]:w-full">
                    {Object.keys(analyzeResult).map((service) => {
                        return (
                            <TabsTrigger
                                key={service}
                                value={service}
                                className="text-normal max-sm:border-border px-3 max-sm:not-last:border-b-2 sm:text-lg"
                            >
                                <span>{serviceInfo[service].icon}</span>
                                {serviceInfo[service].name}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>
                {analyzeResult.axebuilder && (
                    <TabsContent value="axebuilder">
                        <AxeBuilder
                            analyzeResult={analyzeResult.axebuilder}
                            defaultUrl={searchParams.url}
                        />
                    </TabsContent>
                )}
                {analyzeResult.whois && (
                    <TabsContent value="whois">
                        <WhoIs analyzeResult={analyzeResult.whois} />
                    </TabsContent>
                )}
                {analyzeResult.pagespeedinsight && (
                    <TabsContent value="pagespeedinsight">
                        <PageSpeedInsight analyzeResult={analyzeResult.pagespeedinsight} />
                    </TabsContent>
                )}
            </Tabs>
        )
    );
}
