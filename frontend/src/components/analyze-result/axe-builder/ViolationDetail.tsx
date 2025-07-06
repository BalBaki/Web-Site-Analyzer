import Badges from './Badges';
import Assistant from '@/components/Assistant';
import DetailsItem from '@/components/DetailsItem';
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
                            'text-[hsl(var(--critical))]': node.impact === 'critical',
                            'text-[hsl(var(--serious))]': node.impact === 'serious',
                            'text-[hsl(var(--moderate))]': node.impact === 'moderate',
                            'text-[hsl(var(--minor))]': node.impact === 'minor',
                            'text-[hsl(var(--trivial))]': node.impact === 'trivial',
                        }),
                    },
                }}
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
            <DetailsItem data={{ name: 'Description', value: violation.description }} />
            <DetailsItem
                data={{ name: 'HTML', value: node.html }}
                truncateMiddle
            />
            <DetailsItem data={{ name: 'Selector', value: node.target[0] }} />
            <DetailsItem data={{ name: 'Help', value: violation.help }} />
            <DetailsItem
                data={{ name: 'Help URL', value: violation.helpUrl }}
                isLink
            />
            <Assistant
                data={{
                    type: 'acccessbility',
                    description: violation.description,
                    elementHtml: node.html,
                    tool: 'chatgpt',
                }}
            />
            <Badges tags={[node.impact, ...violation.tags]} />
        </dl>
    );
}
