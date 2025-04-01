// 'use client';

// import { useMemo } from 'react';
// import PageSpeedInsightDetailsItem from './PageSpeedInsightDetailsItem';
// import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
// import { cn, detectDataType, getScoreStatus, renderAnyObject } from '@/lib/utils';
// import type { LighthouseAuditResultV5, RenderConfig } from '@/types';

// type PageSpeedInsightAuditProps = {
//     audit: LighthouseAuditResultV5;
// };

// const createRenderConfig = ({
//     name,
//     key,
//     isLink = false,
//     subItems = [],
// }: {
//     name: string;
//     key: string;
//     isLink?: boolean;
//     subItems?: RenderConfig[];
// }): RenderConfig => ({
//     name,
//     key,
//     subItems,
//     render(value) {
//         const { type, data: validatedValue } = detectDataType(value);

//         if (subItems.length) {
//             if (type === 'object') {
//                 return renderAnyObject(subItems, validatedValue);
//             }

//             if (type === 'array') {
//                 return (
//                     <div key={key}>
//                         <h4 className="text-xl font-semibold">{name}</h4>
//                         <div className="space-y-4 pl-4">
//                             {validatedValue.map((item, index) => {
//                                 const { type: itemType, data: itemValue } = detectDataType(item);

//                                 if (itemType !== 'object') return null;

//                                 return <div key={index}>{renderAnyObject(subItems, itemValue)}</div>;
//                             })}
//                         </div>
//                     </div>
//                 );
//             }
//         }

//         return (
//             <PageSpeedInsightDetailsItem
//                 key={this.key}
//                 data={{ name: this.name, value }}
//                 isLink={isLink}
//             />
//         );
//     },
// });

// const detailsRenderConfig: RenderConfig[] = [
//     createRenderConfig({ name: 'Overall Saving Bytes', key: 'overallSavingsBytes' }),
//     createRenderConfig({ name: 'Overall Saving Ms', key: 'overallSavingsMs' }),
//     createRenderConfig({ name: 'Type', key: 'type' }),
//     createRenderConfig({
//         name: 'Items',
//         key: 'items',
//         subItems: [
//             createRenderConfig({ name: 'Total Bytes', key: 'totalBytes' }),
//             createRenderConfig({ name: 'Wasted Bytes', key: 'wastedBytes' }),
//             createRenderConfig({ name: 'Wasted Percent', key: 'wastedPercent' }),
//             createRenderConfig({ name: 'Cache Hit Probability', key: 'cacheHitProbability' }),
//             createRenderConfig({ name: 'Cache Life Time Ms', key: 'cacheLifetimeMs' }),
//             createRenderConfig({ name: 'URL', key: 'url', isLink: true }),
//             createRenderConfig({
//                 name: 'Node',
//                 key: 'node',
//                 subItems: [
//                     createRenderConfig({ name: 'Selector', key: 'selector' }),
//                     createRenderConfig({ name: 'lhId', key: 'lhId' }),
//                     createRenderConfig({ name: 'Node Label', key: 'nodeLabel' }),
//                     createRenderConfig({ name: 'Path', key: 'path' }),
//                     createRenderConfig({ name: 'Explanation', key: 'explanation' }),
//                     createRenderConfig({ name: 'Element', key: 'snippet' }),
//                 ],
//             }),
//             createRenderConfig({ name: 'Wasted Ms', key: 'wastedMs' }),
//             createRenderConfig({ name: 'Blocking Time', key: 'blockingTime' }),
//             createRenderConfig({ name: 'Entity', key: 'entity' }),
//             createRenderConfig({ name: 'Main Thread Time', key: 'mainThreadTime' }),
//             createRenderConfig({ name: 'Tbt Impact', key: 'tbtImpact' }),
//             createRenderConfig({ name: 'Transfer Size', key: 'transferSize' }),
//         ],
//     }),
// ];

// export default function PageSpeedInsightAudit({ audit }: PageSpeedInsightAuditProps) {
//     const scoreStatus = getScoreStatus(audit.score * 100);
//     const isFail = scoreStatus === 'fail';
//     const isAverage = scoreStatus === 'average';
//     const isPass = scoreStatus === 'pass';

//     const renderedDetails = useMemo(() => {
//         if (!audit.details) return null;

//         return renderAnyObject(detailsRenderConfig, audit.details);
//     }, [audit.details]);

//     const scoreIcon = (
//         <span
//             className={cn('size-6 shrink-0', {
//                 'relative h-0 w-0 border-[0_.75rem_1.25rem_.75rem] border-solid border-transparent border-b-[#FF4532]':
//                     isFail,
//                 'bg-score-avarage rounded-sm': isAverage,
//                 'bg-score-pass rounded-full': isPass,
//             })}
//         />
//     );

//     const title = (
//         <h3 className="flex items-center gap-2 text-xl font-medium">
//             {scoreIcon}
//             {audit.title}
//         </h3>
//     );

//     const content = (
//         <dl>
//             {audit.displayValue && (
//                 <div className="flex">
//                     <dt className="shrink-0">Value</dt>
//                     <span className="mx-px">:</span>
//                     <dd>{audit.displayValue}</dd>
//                 </div>
//             )}
//             <div className="flex">
//                 <dt className="shrink-0">Description</dt>
//                 <span className="mx-px">:</span>
//                 <dd>{audit.description}</dd>
//             </div>
//             <div className="flex">
//                 <dt className="shrink-0">Score</dt>
//                 <span className="mx-px">:</span>
//                 <dd
//                     className={cn({
//                         'text-score-pass': isPass,
//                         'text-score-avarage': isAverage,
//                         'text-score-fail': isFail,
//                     })}
//                 >
//                     {audit.score}
//                 </dd>
//             </div>
//             {audit.details && (
//                 <div>
//                     <h4 className="text-2xl font-semibold underline">Details</h4>
//                     {renderedDetails}
//                 </div>
//             )}
//         </dl>
//     );

//     if (!audit.details) {
//         return (
//             <div className="mt-1 space-y-2 border-b-2 break-all">
//                 {title}
//                 <div>{content}</div>
//             </div>
//         );
//     }

//     return (
//         <AccordionItem value={audit.id || ''}>
//             <AccordionTrigger className="cursor-pointer justify-normal space-x-2 text-xl">{title}</AccordionTrigger>
//             <AccordionContent>{content}</AccordionContent>
//         </AccordionItem>
//     );
// }

'use client';

import { useMemo } from 'react';
import PageSpeedInsightDetailsItem from './PageSpeedInsightDetailsItem';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn, detectDataType, getScoreStatus, renderAnyObject } from '@/lib/utils';
import type { LighthouseAuditResultV5, RenderConfig } from '@/types';

type PageSpeedInsightAuditProps = {
    audit: LighthouseAuditResultV5;
};

const createStandardRenderConfig = ({
    name,
    key,
    isLink = false,
}: {
    name: string;
    key: string;
    isLink?: boolean;
}): RenderConfig => ({
    name,
    key,
    render(value) {
        return (
            <PageSpeedInsightDetailsItem
                key={this.key}
                data={{ name: this.name, value }}
                isLink={isLink}
            />
        );
    },
});

const detailsRenderConfig: RenderConfig[] = [
    createStandardRenderConfig({ name: 'Overall Saving Bytes', key: 'overallSavingsBytes' }),
    createStandardRenderConfig({ name: 'Overall Saving Ms', key: 'overallSavingsMs' }),
    createStandardRenderConfig({ name: 'Type', key: 'type' }),
    {
        name: 'Items',
        key: 'items',
        subItems: [
            createStandardRenderConfig({ name: 'Total Bytes', key: 'totalBytes' }),
            createStandardRenderConfig({ name: 'Wasted Bytes', key: 'wastedBytes' }),
            createStandardRenderConfig({ name: 'Wasted Percent', key: 'wastedPercent' }),
            createStandardRenderConfig({ name: 'Cache Hit Probability', key: 'cacheHitProbability' }),
            createStandardRenderConfig({ name: 'Cache Life Time Ms', key: 'cacheLifetimeMs' }),
            createStandardRenderConfig({ name: 'URL', key: 'url', isLink: true }),
            {
                name: 'Node',
                key: 'node',
                subItems: [
                    createStandardRenderConfig({ name: 'Selector', key: 'selector' }),
                    createStandardRenderConfig({ name: 'lhId', key: 'lhId' }),
                    createStandardRenderConfig({ name: 'Node Label', key: 'nodeLabel' }),
                    createStandardRenderConfig({ name: 'Path', key: 'path' }),
                    createStandardRenderConfig({ name: 'Explanation', key: 'explanation' }),
                    createStandardRenderConfig({ name: 'Element', key: 'snippet' }),
                ],
                render: function (value) {
                    const { type, data: validatedValue } = detectDataType(value);

                    if (type !== 'object' || !this.subItems) return null;

                    return renderAnyObject(this.subItems, validatedValue);
                },
            },
            createStandardRenderConfig({ name: 'Wasted Ms', key: 'wastedMs' }),
            createStandardRenderConfig({ name: 'Blocking Time', key: 'blockingTime' }),
            createStandardRenderConfig({ name: 'Entity', key: 'entity' }),
            createStandardRenderConfig({ name: 'Main Thread Time', key: 'mainThreadTime' }),
            createStandardRenderConfig({ name: 'Tbt Impact', key: 'tbtImpact' }),
            createStandardRenderConfig({ name: 'Transfer Size', key: 'transferSize' }),
        ],
        render(value) {
            const { type, data: validatedValue } = detectDataType(value);

            if (type !== 'array') return null;

            return (
                <div key={this.key}>
                    <h4 className="text-xl font-semibold">{this.name}</h4>
                    <div className="space-y-4 pl-4">
                        {validatedValue.map((item, index) => {
                            const { type: itemType, data: validatedItemData } = detectDataType(item);

                            if (itemType !== 'object' || !this.subItems) return null;

                            return <div key={index}>{renderAnyObject(this.subItems, validatedItemData)}</div>;
                        })}
                    </div>
                </div>
            );
        },
    },
];

export default function PageSpeedInsightAudit({ audit }: PageSpeedInsightAuditProps) {
    const scoreStatus = getScoreStatus(audit.score * 100);
    const isFail = scoreStatus === 'fail';
    const isAverage = scoreStatus === 'average';
    const isPass = scoreStatus === 'pass';

    const renderedDetails = useMemo(() => {
        if (!audit.details) return null;

        return renderAnyObject(detailsRenderConfig, audit.details);
    }, [audit.details]);

    const scoreIcon = (
        <span
            className={cn('size-6 shrink-0', {
                'relative h-0 w-0 border-[0_.75rem_1.25rem_.75rem] border-solid border-transparent border-b-[#FF4532]':
                    isFail,
                'bg-score-avarage rounded-sm': isAverage,
                'bg-score-pass rounded-full': isPass,
            })}
        />
    );

    const title = (
        <h3 className="flex items-center gap-2 text-xl font-medium">
            {scoreIcon}
            {audit.title}
        </h3>
    );

    const content = (
        <dl>
            {audit.displayValue && <PageSpeedInsightDetailsItem data={{ name: 'Value', value: audit.displayValue }} />}
            {audit.description && (
                <PageSpeedInsightDetailsItem data={{ name: 'Description', value: audit.description }} />
            )}
            <PageSpeedInsightDetailsItem
                data={{ name: 'Score', value: audit.score }}
                config={{
                    value: {
                        className: cn({
                            'text-score-pass': isPass,
                            'text-score-avarage': isAverage,
                            'text-score-fail': isFail,
                        }),
                    },
                }}
            />
            {audit.details && (
                <div>
                    <h4 className="text-2xl font-semibold underline">Details</h4>
                    {renderedDetails}
                </div>
            )}
        </dl>
    );

    if (!audit.details) {
        return (
            <div className="mt-1 space-y-2 border-b-2 break-all">
                {title}
                <div>{content}</div>
            </div>
        );
    }

    return (
        <AccordionItem value={audit.id || ''}>
            <AccordionTrigger className="cursor-pointer justify-normal space-x-2 text-xl">{title}</AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
    );
}
