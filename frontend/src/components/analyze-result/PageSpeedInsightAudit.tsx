'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn, getScoreStatus } from '@/lib/utils';
import type { LighthouseAuditResultV5 } from '@/types';

type PageSpeedInsightAuditProps = {
    audit: LighthouseAuditResultV5;
};

export default function PageSpeedInsightAudit({ audit }: PageSpeedInsightAuditProps) {
    const scoreStatus = getScoreStatus(audit.score * 100);
    const title = (
        <>
            <span
                className={cn('size-6 shrink-0', {
                    'relative h-0 w-0 border-[0_.75rem_1.25rem_.75rem] border-solid border-transparent border-b-[#FF4532]':
                        scoreStatus === 'fail',
                    'bg-score-avarage rounded-sm': scoreStatus === 'average',
                    'bg-score-pass rounded-full': scoreStatus === 'pass',
                })}
            ></span>
            <span className="mr-auto">{audit.title}</span>
        </>
    );
    const content = (
        <>
            <p>{audit.description}</p>
            <p>{audit.score}</p>
        </>
    );

    if (!audit.details?.items)
        return (
            <div className="mt-1 space-y-2 border-b-2 break-all">
                <div className="flex items-center gap-1 text-xl font-medium">{title}</div>
                <div>{content}</div>
            </div>
        );

    return (
        <AccordionItem value={audit.id || ''}>
            <AccordionTrigger className="cursor-pointer justify-normal space-x-2 text-xl">{title}</AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
    );
}
