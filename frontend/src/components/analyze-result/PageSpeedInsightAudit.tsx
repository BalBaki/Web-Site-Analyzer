'use client';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn, getScoreStatus } from '@/lib/utils';
import type { LighthouseAuditResultV5 } from '@/types';

type PageSpeedInsightAuditProps = {
    audit: LighthouseAuditResultV5;
};

export default function PageSpeedInsightAudit({ audit }: PageSpeedInsightAuditProps) {
    const scoreStatus = getScoreStatus(audit.score * 100);
    const isFail = scoreStatus === 'fail';
    const isAverage = scoreStatus === 'average';
    const isPass = scoreStatus === 'pass';

    const title = (
        <h3 className="flex items-center gap-2 text-xl font-medium">
            <span
                className={cn('size-6 shrink-0', {
                    'relative h-0 w-0 border-[0_.75rem_1.25rem_.75rem] border-solid border-transparent border-b-[#FF4532]':
                        isFail,
                    'bg-score-avarage rounded-sm': isAverage,
                    'bg-score-pass rounded-full': isPass,
                })}
            ></span>
            {audit.title}
        </h3>
    );
    const content = (
        <div>
            <p>Description: {audit.description}</p>
            <p>
                Score:{' '}
                <span
                    className={cn({
                        'text-score-pass': isPass,
                        'text-score-avarage': isAverage,
                        'text-score-fail': isFail,
                    })}
                >
                    {audit.score}
                </span>
            </p>
        </div>
    );

    if (!audit.details?.items)
        return (
            <div className="mt-1 space-y-2 border-b-2 break-all">
                {title}
                <div>{content}</div>
            </div>
        );

    // const isDetailsItemsArray = audit.details?.items instanceof Array;

    return (
        <AccordionItem value={audit.id || ''}>
            <AccordionTrigger className="cursor-pointer justify-normal space-x-2 text-xl">{title}</AccordionTrigger>
            <AccordionContent>
                {content}
                {/* <div>
                    <p>Info: {audit.details.displayValue}</p>
                    <p>Overal Saving Bytes: {audit.details.overallSavingsBytes}</p>
                    {isDetailsItemsArray &&
                        audit.details?.items?.map((item, index) => {
                            return (
                                <div key={index}>
                                    <p>Total Bytes: {item.totalBytes}</p>
                                    <p>Wasted Bytes: {item.wastedBytes}</p>
                                    <p>Wasted Percent: {item.wastedPercent}</p>
                                    <p>URL: {item.url}</p>
                                </div>
                            );
                        })}
                </div> */}
            </AccordionContent>
        </AccordionItem>
    );
}
