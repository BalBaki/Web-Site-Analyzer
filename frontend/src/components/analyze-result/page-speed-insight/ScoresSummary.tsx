'use client';

import { cn, getScoreStatus } from '@/lib/utils';
import ProgressCircle from '../../ProgressCircle';
import type { Categories } from '@/types';

type ScoresSummaryProps = {
    categories: Categories;
};

export default function ScoresSummary({ categories }: ScoresSummaryProps) {
    return (
        <section aria-describedby="score-summary">
            <h3
                id="score-summary"
                className="sr-only"
            >
                Score Summary
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-8">
                {Object.values(categories).map((value) => {
                    const scoreAsPoint = Number((value.score * 100).toFixed(0));
                    const scoreStatus = getScoreStatus(scoreAsPoint);

                    return (
                        <div
                            key={value.title}
                            className="flex flex-col items-center justify-center gap-y-2"
                        >
                            <ProgressCircle
                                percentage={scoreAsPoint}
                                config={{
                                    svg: {
                                        className: cn({
                                            'bg-score-pass/60': scoreStatus === 'pass',
                                            'bg-score-avarage/60': scoreStatus === 'average',
                                            'bg-score-fail/60': scoreStatus === 'fail',
                                        }),
                                    },
                                    progressStick: {
                                        className: cn({
                                            'text-score-pass': scoreStatus === 'pass',
                                            'text-score-avarage': scoreStatus === 'average',
                                            'text-score-fail': scoreStatus === 'fail',
                                        }),
                                    },
                                }}
                            />
                            <h3>{value.title}</h3>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
