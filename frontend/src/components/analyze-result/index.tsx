import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AxeBuilder from './AxeBuilder';
import analyzer from '@/services/analyzer.service';
import WhoIs from './WhoIs';
import PageSpeedInsight from './PageSpeedInsight';
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
        return <div>Error: {analysisData.error || 'Something went wrong..!'}</div>;

    return (
        <>
            {analysisData.analyze && (
                <Tabs defaultValue={Object.keys(analysisData.result)[0]}>
                    <TabsList className="flex-wrap h-auto justify-normal gap-y-1.5">
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
                            <AxeBuilder result={analysisData.result.axebuilder} />
                        </TabsContent>
                    )}
                    {analysisData.result.whois && (
                        <TabsContent value="whois">
                            <WhoIs result={analysisData.result.whois} />
                        </TabsContent>
                    )}
                    {analysisData.result.pagespeedinsight && (
                        <TabsContent value="pagespeedinsight">
                            <PageSpeedInsight result={analysisData.result.pagespeedinsight} />
                        </TabsContent>
                    )}
                </Tabs>
            )}
        </>
    );
}
