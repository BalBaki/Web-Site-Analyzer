import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AxeBuilder from './AxeBuilder';
import analyzer from '@/services/analyzer.service';
import type { AnalyzeResult, AnalyzeSearchParams } from '@/types';
import WhoIs from './WhoIs';

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
                    <TabsList>
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
                </Tabs>
            )}
        </>
    );
}
