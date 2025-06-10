import AxeBuilder from './axe-builder';
import PageSpeedInsight from './page-speed-insight';
import WhoIs from './WhoIs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Status } from '@/enums';
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
    const analyzeResult = await analyzer.analyze(searchParams);

    if (analyzeResult.status === Status.Err) return <div>{analyzeResult.err || 'Something went wrong..!'}</div>;

    return (
        <Tabs defaultValue={Object.keys(analyzeResult.data)[0]}>
            <TabsList className="h-auto w-auto flex-wrap justify-normal gap-y-1.5">
                {Object.keys(analyzeResult.data).map((service) => {
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
