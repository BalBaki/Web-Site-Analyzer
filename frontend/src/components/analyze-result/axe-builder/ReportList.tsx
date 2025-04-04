import { useMemo } from 'react';
import { useAxeBuilderContext } from '.';
import ViolationDetail from './ViolationDetail';
import ViolationDetailCarousel from './ViolationDetailCarousel';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AccessibilityViolation } from '@/types';

export default function ReportList() {
    const { selectedReport } = useAxeBuilderContext();

    //Maybe delete useMemo
    const resultGroupedById = useMemo(() => {
        return !selectedReport || selectedReport.result.length < 0
            ? null
            : selectedReport.result.reduce((acc: Record<string, AccessibilityViolation>, item) => {
                  if (!acc[item.id]) {
                      acc[item.id] = { ...item, nodes: [...item.nodes] };
                  } else {
                      acc[item.id].nodes.push(...item.nodes);
                  }

                  return acc;
              }, {});
    }, [selectedReport]);

    if (!resultGroupedById) return null;

    const renderedResult = Object.entries(resultGroupedById).map(([id, violation]) => {
        if (!violation.nodes.length) return null;

        return (
            <AccordionItem
                value={id + selectedReport?.url}
                key={id}
                className="w-full max-w-(--breakpoint-lg)"
            >
                <AccordionTrigger className="text-red-400 underline">{violation.help}</AccordionTrigger>
                <AccordionContent>
                    {violation.nodes.length > 1 ? (
                        <ViolationDetailCarousel violation={violation} />
                    ) : (
                        <ViolationDetail data={{ node: violation.nodes[0], violation }} />
                    )}
                </AccordionContent>
            </AccordionItem>
        );
    });

    return <Accordion type="multiple">{renderedResult}</Accordion>;
}
