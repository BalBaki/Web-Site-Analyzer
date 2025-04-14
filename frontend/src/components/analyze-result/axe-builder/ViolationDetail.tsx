import Assistant from '@/components/Assistant';
import DetailsItem from '@/components/DetailsItem';
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
        <dl>
            <DetailsItem
                data={{ name: 'Impact', value: node.impact }}
                config={{
                    value: {
                        className: cn('capitalize', {
                            'text-[hsl(var(--chart-1))]': node.impact === 'critical',
                            'text-[hsl(var(--chart-2))]': node.impact === 'serious',
                            'text-[hsl(var(--chart-3))]': node.impact === 'moderate',
                            'text-[hsl(var(--chart-4))]': node.impact === 'minor',
                            'text-[hsl(var(--chart-5))]': node.impact === 'trivial',
                        }),
                    },
                }}
            />
            <DetailsItem data={{ name: 'HTML', value: node.html }} />
            <DetailsItem data={{ name: 'Selector', value: node.target[0] }} />
            <DetailsItem data={{ name: 'Description', value: violation.description }} />
            <DetailsItem data={{ name: 'Help', value: violation.help }} />
            <DetailsItem
                data={{ name: 'Help URL', value: violation.helpUrl }}
                isLink
            />

            {node.all.length > 0 && (
                <>
                    <DetailsItem data={{ name: 'Message', value: node.all[0].message }} />
                    {node.all[0].data?.contrastRatio >= 0 && (
                        <DetailsItem data={{ name: 'Current Ratio', value: node.all[0].data.contrastRatio }} />
                    )}
                    {node.all[0].data?.expectedContrastRatio && (
                        <DetailsItem data={{ name: 'Expected Ratio', value: node.all[0].data.expectedContrastRatio }} />
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
        </dl>
    );
}
