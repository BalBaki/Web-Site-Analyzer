'use client';

import { useMemo } from 'react';
import PageSpeedInsightAudit from './PageSpeedInsightAudit';
import PageSpeedInsightPreview from './PageSpeedInsightPreview';
import { Accordion } from '@/components/ui/accordion';
import { PAGE_SPEED_INSIGHT_STATUS_PRIORTY } from '@/constant';
import { getScoreStatus } from '@/lib/utils';
import type { LighthouseAuditResultV5, LighthouseCategoryV5, PagespeedApiPagespeedResponseV5 } from '@/types';

type PageSpeedInsightTabProps = {
    data: PagespeedApiPagespeedResponseV5;
};

export default function PageSpeedInsightTab({ data }: PageSpeedInsightTabProps) {
    const processedAudits = useMemo(() => {
        const auditValues = Object.values(data.lighthouseResult?.audits || {});

        return (Object.values(data.lighthouseResult?.categories || {}) as LighthouseCategoryV5[]).reduce(
            (acc, category) => {
                const filteredAudits = category.auditRefs
                    ?.map((auditRef) => {
                        const audit = auditValues.find((a) => a.id === auditRef.id);
                        const scoreAsNumber = parseInt(audit?.score);

                        if (!audit || isNaN(scoreAsNumber) || scoreAsNumber === 1) return null;

                        return audit;
                    })
                    .filter((audit): audit is LighthouseAuditResultV5 => Boolean(audit))
                    .toSorted((a, b) => {
                        const aScoreStatus = getScoreStatus(a.score * 100);
                        const bScoreStatus = getScoreStatus(b.score * 100);

                        return (
                            PAGE_SPEED_INSIGHT_STATUS_PRIORTY[aScoreStatus] -
                            PAGE_SPEED_INSIGHT_STATUS_PRIORTY[bScoreStatus]
                        );
                    });

                if (filteredAudits?.length) {
                    acc.push({
                        category,
                        renderedAudits: filteredAudits.map((audit) => (
                            <PageSpeedInsightAudit
                                key={audit.id}
                                audit={audit}
                            />
                        )),
                    });
                }

                return acc;
            },
            [] as Array<{
                category: LighthouseCategoryV5;
                renderedAudits: React.ReactNode[];
            }>,
        );
    }, [data]);

    return (
        <div className="rounded-md border-2 border-gray-400 p-4">
            {data.lighthouseResult?.categories && (
                <PageSpeedInsightPreview categories={data.lighthouseResult?.categories} />
            )}
            <div className="space-y-8">
                <Accordion type="multiple">
                    {processedAudits.map(({ category, renderedAudits }) => (
                        <div
                            key={category.id}
                            className="mb-4 border-t-4"
                        >
                            <h4 className="mb-4 text-2xl font-bold">{category.title}</h4>
                            {renderedAudits}
                        </div>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
