import Link from 'next/link';
import Assistant from '@/components/Assistant';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AccessibilityViolation } from '@/types';

type ViolationDetailProps = {
    data: {
        violation: AccessibilityViolation;
        node: AccessibilityViolation['nodes'][number];
    };
};

export default function ViolationDetail({ data: { violation, node } }: ViolationDetailProps) {
    return (
        <>
            <div>
                Impact :{' '}
                <span
                    className={cn('capitalize', {
                        'text-[hsl(var(--chart-1))]': node.impact === 'critical',
                        'text-[hsl(var(--chart-2))]': node.impact === 'serious',
                        'text-[hsl(var(--chart-3))]': node.impact === 'moderate',
                        'text-[hsl(var(--chart-4))]': node.impact === 'minor',
                        'text-[hsl(var(--chart-5))]': node.impact === 'trivial',
                    })}
                >
                    {node.impact}
                </span>
            </div>
            <div>HTML : {node.html}</div>
            <div>Selector: {node.target}</div>
            <div>Description: {violation.description}</div>
            <div>Help: {violation.help}</div>
            <div>
                Help URL:
                <Link
                    href={violation.helpUrl}
                    target="_blank"
                    className="ml-1 underline"
                >
                    {violation.helpUrl}
                </Link>
            </div>
            {node.all.length > 0 && (
                <>
                    <div>Message: {`${node.all[0].message}`}</div>
                    {node.all[0].data?.contrastRatio >= 0 && <div>Current Ratio: {node.all[0].data.contrastRatio}</div>}
                    {node.all[0].data?.expectedContrastRatio && (
                        <div>Expected Ratio: {node.all[0].data.expectedContrastRatio}</div>
                    )}
                </>
            )}
            <Assistant
                data={{
                    type: 'acccessbility',
                    description: violation.description,
                    elementHtml: node.html,
                }}
            />
            <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge className="capitalize">{node.impact}</Badge>
                {violation.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                ))}
            </div>
        </>
    );
}
