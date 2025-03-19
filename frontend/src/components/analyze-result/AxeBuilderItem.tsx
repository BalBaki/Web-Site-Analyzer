'use client';

import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { calculateImpactErrors } from '@/lib/utils';
import AxeBuilderCarousel from './AxeBuilderCarousel';
import type { AxeBuilderResult } from '@/types';

type AxeBuilderProps = {
    axeReport: AxeBuilderResult[number];
};

const chartConfig = {
    count: {
        label: 'Count',
    },
    critical: {
        label: 'Critical',
        color: 'hsl(var(--chart-1))',
    },
    serious: {
        label: 'Serious',
        color: 'hsl(var(--chart-2))',
    },
    moderate: {
        label: 'Moderate',
        color: 'hsl(var(--chart-3))',
    },
    minor: {
        label: 'Minor',
        color: 'hsl(var(--chart-4))',
    },
    trivial: {
        label: 'Trivial',
        color: 'hsl(var(--chart-5))',
    },
} satisfies ChartConfig;

export default function AxeBuilderItem({ axeReport: { result, url } }: AxeBuilderProps) {
    if (result.length < 0) return null;

    const errorCount = calculateImpactErrors(result);
    const resultGroupedById = Object.groupBy(result, ({ id }) => id);
    const chartTickCount = Math.ceil(Object.values(errorCount).toSorted((a, b) => b - a)[1] / 5) + 1;

    const renderedResult = Object.keys(resultGroupedById).map((id) => {
        return (
            <AccordionItem
                value={id + url}
                key={id + url}
                className="w-full max-w-screen-lg"
            >
                <AccordionTrigger className="underline text-red-400">
                    {resultGroupedById[id]?.[0]?.help}
                </AccordionTrigger>
                <AccordionContent>
                    {resultGroupedById[id] && <AxeBuilderCarousel result={resultGroupedById[id]} />}
                </AccordionContent>
            </AccordionItem>
        );
    });

    return (
        <section aria-label="Axe builder analyze result">
            <Card>
                <CardHeader>
                    <CardTitle>Error Count</CardTitle>
                    <CardDescription className="sr-only">This card shows count of errors</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer
                        config={chartConfig}
                        className="w-full max-w-screen-sm"
                    >
                        <BarChart
                            accessibilityLayer
                            data={[
                                {
                                    impact: 'critical',
                                    count: errorCount.critical,
                                    fill: 'var(--color-critical)',
                                },
                                {
                                    impact: 'serious',
                                    count: errorCount.serious,
                                    fill: 'var(--color-serious)',
                                },
                                {
                                    impact: 'moderate',
                                    count: errorCount.moderate,
                                    fill: 'var(--color-moderate)',
                                },
                                {
                                    impact: 'minor',
                                    count: errorCount.minor,
                                    fill: 'var(--color-minor)',
                                },
                                {
                                    impact: 'trivial',
                                    count: errorCount.trivial,
                                    fill: 'var(--color-trivial)',
                                },
                            ]}
                            layout="vertical"
                            margin={{
                                left: 0,
                            }}
                        >
                            <YAxis
                                dataKey="impact"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                            />
                            <XAxis
                                dataKey="count"
                                type="number"
                                ticks={Array.from(
                                    {
                                        length: chartTickCount,
                                    },
                                    (_, i) => i * 5
                                )}
                                tickCount={chartTickCount}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Bar
                                dataKey="count"
                                layout="vertical"
                                radius={5}
                            />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
            </Card>
            <Accordion type="multiple">{renderedResult}</Accordion>
        </section>
    );
}
