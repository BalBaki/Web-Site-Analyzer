'use client';

import Audit from './Audit';
import ScoresSummary from './ScoresSummary';
import { Accordion } from '@/components/ui/accordion';
import type { TransformedPageSpeedData } from '@/types';

type TabProps = {
    data: TransformedPageSpeedData;
};

export default function Tab({ data }: TabProps) {
    return (
        <div className="rounded-md border-2 border-gray-400 p-4">
            <ScoresSummary categories={data.categories} />
            <section aria-describedby="audit-list">
                <h3
                    id="audit-list"
                    className="sr-only"
                >
                    Audit List
                </h3>
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
                                        <article key={result.id}>
                                            <Audit audit={result} />
                                        </article>
                                    );
                                })}
                            </div>
                        ))}
                    </Accordion>
                </div>
            </section>
        </div>
    );
}
