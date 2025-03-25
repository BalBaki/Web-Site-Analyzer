import { cn, getScoreStatus } from '@/lib/utils';
import ProgressCircle from '../ProgressCircle';
import type { Categories } from '@/types';

type PageSpeedInsightPreviewProps = {
    categories: Categories;
};

export default function PageSpeedInsightPreview({ categories }: PageSpeedInsightPreviewProps) {
    return (
        <div className="flex items-center justify-center gap-8">
            {Object.values(categories).map((value) => {
                const scoreAsPoint = value.score * 100;
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
                                        'bg-score-pass/60': scoreStatus.isPass,
                                        'bg-score-avarage/60': scoreStatus.isAverage,
                                        'bg-score-fail/60': scoreStatus.isFail,
                                    }),
                                },
                                progressStick: {
                                    className: cn({
                                        'text-score-pass': scoreStatus.isPass,
                                        'text-score-avarage': scoreStatus.isAverage,
                                        'text-score-fail': scoreStatus.isFail,
                                    }),
                                },
                            }}
                        />
                        <h3>{value.title}</h3>
                    </div>
                );
            })}
        </div>
    );
}
