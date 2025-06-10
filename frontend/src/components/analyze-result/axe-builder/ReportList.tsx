import { useMemo } from 'react';
import { useAxeBuilderContext } from '.';
import ViolationDetail from './ViolationDetail';
import ViolationDetailCarousel from './ViolationDetailCarousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Status } from '@/enums';
import type { AccessibilityViolation } from '@/types';

const COLUMN_COUNT = 2;

export default function ReportList() {
    const { selectedReport } = useAxeBuilderContext();
    const isErrorExists = selectedReport && selectedReport.status === Status.Err;

    //Maybe delete useMemo
    const resultGroupedById = useMemo(() => {
        if (!selectedReport || isErrorExists || selectedReport.data.result.length < 0) return null;

        return selectedReport.data.result.reduce((acc: Record<string, AccessibilityViolation>, item) => {
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
                <AccordionItem value={id + selectedReport?.url}>
                    <AccordionTrigger className="text-red-400 underline">{violation.help}</AccordionTrigger>
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
        <section aria-describedby="violations-list">
            <h3
                id="violations-list"
                className="sr-only"
            >
                Violations List
            </h3>
            <Accordion
                type="multiple"
                className="md:flex md:gap-x-2"
            >
                {Array.from({ length: COLUMN_COUNT }, (_, index) => {
                    return (
                        <div
                            key={index}
                            style={{
                                width: `${widthPercantage}%`,
                            }}
                            className="flex flex-col max-md:w-full!"
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
