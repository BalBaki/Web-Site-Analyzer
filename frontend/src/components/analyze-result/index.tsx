import AxeBuilder from './axe-builder';
import PageSpeedInsight from './page-speed-insight';
import WhoIs from './WhoIs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import analyzer from '@/services/analyzer.service';
import type { AnalyzeResult, AnalyzeSearchParams } from '@/types';

type AnalyzeResultProps = {
    searchParams: AnalyzeSearchParams;
};

const services = {
    axebuilder: 'Axe Builder',
    pagespeedinsight: 'Page Speed Insight',
    whois: 'Who Is',
} as const;

export default async function AnalyzeResult({ searchParams }: AnalyzeResultProps) {
    const analysisData = await analyzer.analyze(searchParams);

    if (!analysisData.analyze && analysisData.error)
        return <div>{analysisData.error || 'Something went wrong..!'}</div>;

    return (
        <>
            {analysisData.analyze && (
                <Tabs defaultValue={Object.keys(analysisData.result)[0]}>
                    <TabsList className="h-auto flex-wrap justify-normal gap-y-1.5">
                        {Object.keys(analysisData.result).map((service) => {
                            return (
                                <TabsTrigger
                                    key={service}
                                    value={service}
                                    className="capitalize"
                                >
                                    {services[service as keyof typeof services]}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                    {analysisData.result.axebuilder && (
                        <TabsContent value="axebuilder">
                            <AxeBuilder
                                analyzeResult={analysisData.result.axebuilder}
                                defaultUrl={searchParams.url}
                            />
                        </TabsContent>
                    )}
                    {analysisData.result.whois && (
                        <TabsContent value="whois">
                            <WhoIs analyzeResult={analysisData.result.whois} />
                        </TabsContent>
                    )}
                    {analysisData.result.pagespeedinsight && (
                        <TabsContent value="pagespeedinsight">
                            <PageSpeedInsight analyzeResult={analysisData.result.pagespeedinsight} />
                        </TabsContent>
                    )}
                </Tabs>
            )}
        </>
    );
}
