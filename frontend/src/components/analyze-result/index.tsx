import AxeBuilder from './axe-builder';
import PageSpeedInsight from './page-speed-insight';
import WhoIs from './WhoIs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Status } from '@/enums';
import { AnalyzerService } from '@/services/analyzer.service';
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

export default async function AnalyzeResult({ searchParams }: AnalyzeResultProps) {
    const analyzeResult = await AnalyzerService.analyze(searchParams);

    if (analyzeResult.status === Status.Err) return <div>{analyzeResult.err || 'Something went wrong..!'}</div>;

    return (
        <Tabs defaultValue={Object.keys(analyzeResult.data)[0]}>
            <TabsList className="mx-auto h-11 w-full justify-normal max-sm:h-auto max-sm:flex-col max-sm:gap-y-3 max-sm:pt-2 max-sm:[&>button]:w-full">
                {Object.keys(analyzeResult.data).map((service) => {
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
            {analyzeResult.data.axebuilder && (
                <TabsContent value="axebuilder">
                    <AxeBuilder
                        analyzeResult={analyzeResult.data.axebuilder}
                        defaultUrl={searchParams.url}
                    />
                </TabsContent>
            )}
            {analyzeResult.data.whois && (
                <TabsContent value="whois">
                    <WhoIs analyzeResult={analyzeResult.data.whois} />
                </TabsContent>
            )}
            {analyzeResult.data.pagespeedinsight && (
                <TabsContent value="pagespeedinsight">
                    <PageSpeedInsight analyzeResult={analyzeResult.data.pagespeedinsight} />
                </TabsContent>
            )}
        </Tabs>
    );
}
