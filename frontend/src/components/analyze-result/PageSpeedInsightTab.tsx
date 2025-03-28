'use client';

import PageSpeedInsightAudit from './PageSpeedInsightAudit';
import PageSpeedInsightPreview from './PageSpeedInsightPreview';
import { Accordion } from '@/components/ui/accordion';
import type { TransformedPageSpeedData } from '@/types';

type PageSpeedInsightTabProps = {
    data: TransformedPageSpeedData;
};

export default function PageSpeedInsightTab({ data }: PageSpeedInsightTabProps) {
    return (
        <div className="rounded-md border-2 border-gray-400 p-4">
            <PageSpeedInsightPreview categories={data.categories} />

            <div className="space-y-8">
                <Accordion type="multiple">
                    {data.audits.map(({ category, results }) => (
                        <div
                            key={category.id}
                            className="mb-4 border-t-4"
                        >
                            <h4 className="mb-4 text-2xl font-bold">{category.title}</h4>
                            {results.map((result) => {
                                return (
                                    <PageSpeedInsightAudit
                                        key={result.id}
                                        audit={result}
                                    />
                                );
                            })}
                        </div>
                    ))}
                </Accordion>
            </div>
        </div>
    );
}
