'use client';

import { useMemo } from 'react';
import DetailsItemCarousel from './DetailsItemCarousel';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn, detectDataType, getScoreStatus, renderNestedData } from '@/lib/utils';
import DetailsItem from '../../DetailsItem';
import type { JSX } from 'react';
import type { LighthouseAuditResultV5, RenderConfig, SimpleRenderConfig } from '@/types';

type AuditProps = {
    audit: LighthouseAuditResultV5;
};

const builderRenderConfigTree = (configs: SimpleRenderConfig[]): RenderConfig[] => {
    if (!configs.length) return [];

    return configs.map((config) => {
        const { isLink, childConfigs = [], ...rest } = config;
        const transformedChildConfigs = builderRenderConfigTree(childConfigs);

        return {
            ...rest,
            childConfigs: transformedChildConfigs,
            render: (value) => {
                const { type } = detectDataType(value);
                let result: JSX.Element | null;
                const { key, name, container } = rest;

                if (!transformedChildConfigs.length) {
                    result = (
                        <DetailsItem
                            key={key}
                            data={{ name, value }}
                            isLink={isLink}
                        />
                    );
                } else {
                    const renderedNestedData = renderNestedData(transformedChildConfigs, value);

                    if (!renderedNestedData || renderedNestedData.length < 1) return null;

                    result =
                        renderedNestedData.length > 1 && type === 'array' ? (
                            <DetailsItemCarousel
                                key={key}
                                renderedData={renderedNestedData}
                            />
                        ) : (
                            <div key={key}>{renderedNestedData}</div>
                        );
                }

                return result && (container ? container.call(this, result) : result);
            },
        };
    });
};

const renderConfigTree = builderRenderConfigTree([
    { name: 'Overall Saving Bytes', key: 'overallSavingsBytes' },
    { name: 'Overall Saving Ms', key: 'overallSavingsMs' },
    { name: 'Type', key: 'type' },
    {
        name: 'Items',
        key: 'items',
        childConfigs: [
            { name: 'Total Bytes', key: 'totalBytes' },
            { name: 'Wasted Bytes', key: 'wastedBytes' },
            { name: 'Wasted Percent', key: 'wastedPercent' },
            { name: 'Cache Hit Probability', key: 'cacheHitProbability' },
            { name: 'Cache Life Time Ms', key: 'cacheLifetimeMs' },
            { name: 'URL', key: 'url', isLink: true },
            { name: 'Href', key: 'href', isLink: true },
            { name: 'Script URL', key: 'scriptUrl', isLink: true },
            { name: 'Wasted Ms', key: 'wastedMs' },
            { name: 'Blocking Time', key: 'blockingTime' },
            { name: 'Entity', key: 'entity' },
            { name: 'Main Thread Time', key: 'mainThreadTime' },
            { name: 'Tbt Impact', key: 'tbtImpact' },
            { name: 'Transfer Size', key: 'transferSize' },
            {
                name: 'Node',
                key: 'node',
                childConfigs: [
                    { name: 'Selector', key: 'selector' },
                    { name: 'lhId', key: 'lhId' },
                    { name: 'Node Label', key: 'nodeLabel' },
                    { name: 'Path', key: 'path' },
                    { name: 'Explanation', key: 'explanation' },
                    { name: 'Element', key: 'snippet' },
                ],
            },
            {
                name: 'Items',
                key: 'items',
                childConfigs: [
                    { name: 'Score', key: 'score' },
                    {
                        name: 'Node',
                        key: 'node',
                        childConfigs: [
                            { name: 'Selector', key: 'selector' },
                            { name: 'lhId', key: 'lhId' },
                            { name: 'Node Label', key: 'nodeLabel' },
                            { name: 'Path', key: 'path' },
                            { name: 'Explanation', key: 'explanation' },
                            { name: 'Element', key: 'snippet' },
                        ],
                    },
                ],
            },
            {
                name: 'Sub Items',
                key: 'subItems',
                childConfigs: [
                    {
                        name: 'Items',
                        key: 'items',
                        childConfigs: [
                            { name: 'Signal', key: 'signal' },
                            {
                                name: 'Location',
                                key: 'location',
                                childConfigs: [
                                    { key: 'column', name: 'Column' },
                                    { key: 'line', name: 'Line' },
                                    { key: 'url', name: 'URL', isLink: true },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

export default function Audit({ audit }: AuditProps) {
    const scoreStatus = getScoreStatus(audit.score * 100);
    const isFail = scoreStatus === 'fail';
    const isAverage = scoreStatus === 'average';
    const isPass = scoreStatus === 'pass';

    const renderedDetails = useMemo(() => {
        if (!audit.details) return null;

        return renderNestedData(renderConfigTree, audit.details);
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

    const content = (
        <dl>
            {audit.displayValue && <DetailsItem data={{ name: 'Value', value: audit.displayValue }} />}
            {audit.description && <DetailsItem data={{ name: 'Description', value: audit.description }} />}
            <DetailsItem
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
                <h5 className="flex items-center gap-2 text-xl font-medium">
                    {scoreIcon}
                    {audit.title}
                </h5>
                <div>{content}</div>
            </div>
        );
    }

    return (
        <AccordionItem value={audit.id || ''}>
            <AccordionTrigger className="cursor-pointer justify-normal space-x-2 text-xl">
                {scoreIcon}
                {audit.title}
            </AccordionTrigger>
            <AccordionContent>{content}</AccordionContent>
        </AccordionItem>
    );
}
