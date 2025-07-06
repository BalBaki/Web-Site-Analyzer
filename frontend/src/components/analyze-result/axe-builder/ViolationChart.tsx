import { useMemo } from 'react';
import { useAxeBuilderContext } from '.';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Status } from '@/enums';
import { calculateImpactErrors } from '@/lib/utils';
import type { ChartConfig } from '@/components/ui/chart';

const chartConfig = {
    count: {
        label: 'Count',
    },
    critical: {
        label: 'Critical',
        color: 'hsl(var(--critical))',
    },
    serious: {
        label: 'Serious',
        color: 'hsl(var(--serious))',
    },
    moderate: {
        label: 'Moderate',
        color: 'hsl(var(--moderate))',
    },
    minor: {
        label: 'Minor',
        color: 'hsl(var(--minor))',
    },
    trivial: {
        label: 'Trivial',
        color: 'hsl(var(--trivial))',
    },
} satisfies ChartConfig;

export default function ViolationChart() {
    const { selectedReport } = useAxeBuilderContext();

    //Maybe delete useMemo
    const chartData = useMemo(() => {
        if (!selectedReport || selectedReport.status === Status.Err || selectedReport.data.violations.length <= 0)
            return null;

        const counts = calculateImpactErrors(selectedReport.data.violations);
        const chartTickCount = Math.ceil(Object.values(counts).toSorted((a, b) => b - a)[1] / 5) + 1;

        return {
            counts,
            tickCount: chartTickCount,
        };
    }, [selectedReport]);

    if (!chartData) return null;

    const { counts, tickCount } = chartData;

    return (
        <section
            aria-describedby="violation-chart"
            className="pb-1"
        >
            <h3
                id="violation-chart"
                className="sr-only"
            >
                Violation Chart
            </h3>
            <Card
                id="chart"
                className="shadow-background border-0 p-2 md:px-2 md:py-4"
            >
                <CardHeader className="p-0">
                    <CardTitle className="sr-only">Violation Count</CardTitle>
                    <CardDescription className="sr-only">This card shows count of violations</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <ChartContainer
                        config={chartConfig}
                        className="w-full max-w-(--breakpoint-sm)"
                    >
                        <BarChart
                            accessibilityLayer
                            data={[
                                {
                                    impact: 'critical',
                                    count: counts.critical,
                                    fill: 'var(--color-critical)',
                                },
                                {
                                    impact: 'serious',
                                    count: counts.serious,
                                    fill: 'var(--color-serious)',
                                },
                                {
                                    impact: 'moderate',
                                    count: counts.moderate,
                                    fill: 'var(--color-moderate)',
                                },
                                {
                                    impact: 'minor',
                                    count: counts.minor,
                                    fill: 'var(--color-minor)',
                                },
                                {
                                    impact: 'trivial',
                                    count: counts.trivial,
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
                                width={70}
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
                                        length: tickCount,
                                    },
                                    (_, i) => i * 5,
                                )}
                                tickCount={tickCount}
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
                <CardFooter className="flex-col items-start gap-2 p-0 text-sm"></CardFooter>
            </Card>
        </section>
    );
}
