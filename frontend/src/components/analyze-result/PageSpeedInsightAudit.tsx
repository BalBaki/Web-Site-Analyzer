import type { LighthouseAuditResultV5 } from '@/types';

type PageSpeedInsightAuditProps = {
    audit: LighthouseAuditResultV5;
};

export default function PageSpeedInsightAudit({ audit }: PageSpeedInsightAuditProps) {
    return (
        <div>
            <h4>{audit.title}</h4>
            <p>{audit.description}</p>
            <p>{audit.score}</p>
        </div>
    );
}
