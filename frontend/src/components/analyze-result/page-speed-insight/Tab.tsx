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
        <div className="py-2">
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
                            <div key={category.id}>
                                <h4 className="my-2 border-y-2 p-3 text-2xl font-bold">{category.title}</h4>
                                {results.map((result) => {
                                    return (
                                        <article
                                            key={result.id}
                                            className="mx-3 py-1 not-last:border-b-2"
                                        >
                                            <Audit
                                                audit={result}
                                                categoryId={category.id}
                                            />
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
