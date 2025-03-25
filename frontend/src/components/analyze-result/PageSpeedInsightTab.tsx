import PageSpeedInsightAudit from './PageSpeedInsightAudit';
import PageSpeedInsightPreview from './PageSpeedInsightPreview';
import type { LighthouseCategoryV5, PagespeedApiPagespeedResponseV5 } from '@/types';

type PageSpeedInsightTabProps = {
    data: PagespeedApiPagespeedResponseV5;
};

export default function PageSpeedInsightTab({ data }: PageSpeedInsightTabProps) {
    //TODO: Maybe useMemo
    const auditValues = Object.values(data.lighthouseResult?.audits || {});
    const renderedCategories = (Object.values(data.lighthouseResult?.categories || {}) as LighthouseCategoryV5[]).map(
        (category) => {
            const renderedAuditRefs = category.auditRefs?.map((auditRef) => {
                const audit = auditValues.find((audit) => audit.id === auditRef.id);

                if (!audit) return null;

                return (
                    <PageSpeedInsightAudit
                        key={audit.id}
                        audit={audit}
                    />
                );
            });

            return (
                <div
                    key={category.id}
                    className="border-t-4"
                >
                    <h4 className="text-7xl font-bold">{category.title}</h4>
                    {renderedAuditRefs}
                </div>
            );
        },
    );

    return (
        <div className="rounded-md border-2 border-gray-400 py-3">
            {data.lighthouseResult?.categories && (
                <PageSpeedInsightPreview categories={data.lighthouseResult?.categories} />
            )}
            <div className="space-y-8">{renderedCategories}</div>
        </div>
    );
}
