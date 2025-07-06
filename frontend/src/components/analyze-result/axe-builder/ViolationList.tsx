import { useMemo } from 'react';
import { useAxeBuilderContext } from '.';
import ViolationDetail from './ViolationDetail';
import ViolationDetailCarousel from './ViolationDetailCarousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Status } from '@/enums';
import { cn } from '@/lib/utils';
import type { AccessibilityViolation } from '@/types';

const COLUMN_COUNT = 2;

export default function ViolationList() {
    const { selectedReport } = useAxeBuilderContext();
    const isErrorExists = selectedReport && selectedReport.status === Status.Err;

    //Maybe delete useMemo
    const resultGroupedById = useMemo(() => {
        if (!selectedReport || isErrorExists || selectedReport.data.violations.length < 0) return null;

        return selectedReport.data.violations.reduce((acc: Record<string, AccessibilityViolation>, item) => {
            if (!acc[item.id]) {
                acc[item.id] = { ...item, nodes: [...item.nodes] };
            } else {
                acc[item.id].nodes.push(...item.nodes);
            }

            return acc;
        }, {});
    }, [isErrorExists, selectedReport]);

    if (isErrorExists) return <div>Error at Analyzing Page</div>;
    if (!resultGroupedById) return null;

    const renderedResult = Object.entries(resultGroupedById).map(([id, violation]) => {
        if (!violation.nodes.length) return null;

        return (
            <article key={id}>
                <AccordionItem
                    value={id + selectedReport?.url}
                    className={cn('rounded-2xl border-2 px-2 last:border-b-2', {
                        'border-[hsl(var(--critical))]': violation.impact === 'critical',
                        'border-[hsl(var(--serious))]': violation.impact === 'serious',
                        'border-[hsl(var(--moderate))]': violation.impact === 'moderate',
                        'border-[hsl(var(--minor))]': violation.impact === 'minor',
                        'border-[hsl(var(--trivial))]': violation.impact === 'trivial',
                    })}
                >
                    <AccordionTrigger className="group data-[state=closed]:overflow-hidden">
                        <span className="group-data-[state=closed]:truncate">{violation.help}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        {violation.nodes.length > 1 ? (
                            <ViolationDetailCarousel violation={violation} />
                        ) : (
                            <ViolationDetail data={{ node: violation.nodes[0], violation }} />
                        )}
                    </AccordionContent>
                </AccordionItem>
            </article>
        );
    });

    if (!renderedResult || !renderedResult.length) return 'No Analyze Result..!';

    const itemCountPerColumn = Math.round(renderedResult.length / COLUMN_COUNT);
    const widthPercantage = Number(100 / COLUMN_COUNT).toFixed(2);

    return (
        <section
            aria-describedby="violation-list"
            className="px-1 pt-2"
        >
            <h3
                id="violation-list"
                className="sr-only"
            >
                Violation List
            </h3>
            <Accordion
                type="multiple"
                className="md: gap-2 max-md:space-y-2 md:flex"
            >
                {Array.from({ length: COLUMN_COUNT }, (_, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                width: `${widthPercantage}%`,
                            }}
                            className="flex flex-col gap-2 max-md:w-full!"
                        >
                            {renderedResult.slice(
                                index * itemCountPerColumn,
                                Math.min((index + 1) * itemCountPerColumn, renderedResult.length),
                            )}
                        </div>
                    );
                })}
            </Accordion>
        </section>
    );
}
