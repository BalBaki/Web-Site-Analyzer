/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DATA_TYPES_WITH_SCHEMAS, PAGE_SPEED_INSIGHT_STATUS_PRIORTY } from '@/constant';
import type { ClassValue } from 'clsx';
import type {
    AccessibilityViolation,
    AnyDetectedDataResult,
    ImpactSeverity,
    LighthouseAuditResultV5,
    LighthouseCategoryV5,
    PagespeedApiPagespeedResponseV5,
    PageSpeedInsightData,
    PageSpeedResultsMap,
    RenderConfig,
    ScoreStatus,
    TransformedPageSpeedData,
} from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const stringifyValue = <T>(value: T): string =>
    value === null || value === undefined
        ? ''
        : typeof value === 'object'
          ? value instanceof Date
              ? value.toISOString()
              : JSON.stringify(value)
          : String(value);

export const stringifyObjectValues = <T extends Record<string, unknown>>(payload: T): Record<keyof T, string> =>
    Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, stringifyValue(value)])) as Record<
        keyof T,
        string
    >;

export const calculateImpactErrors = (payload: AccessibilityViolation[]): Record<ImpactSeverity | 'total', number> =>
    payload.reduce(
        (counts: Record<ImpactSeverity | 'total', number>, error) => {
            if (Object.keys(counts).includes(error.impact)) counts[error.impact] += error.nodes.length;
            else counts[error.impact] = error.nodes.length;

            counts.total += error.nodes.length;

            return counts;
        },
        {
            total: 0,
        } as Record<ImpactSeverity | 'total', number>,
    );

export const getScoreStatus = (score: number): ScoreStatus => {
    if (score < 0 || score > 100) {
        return 'fail';
    }
    if (score >= 90) return 'pass';
    if (score >= 50) return 'average';

    return 'fail';
};

export const transformPageSpeedData = (data: PageSpeedInsightData) =>
    Object.entries(data).reduce((transformedData: PageSpeedResultsMap, [category, value]) => {
        const typedValue = value as PagespeedApiPagespeedResponseV5;
        const auditValues = Object.values(typedValue.lighthouseResult?.audits || {});

        transformedData[category] = {} as TransformedPageSpeedData;

        transformedData[category]['audits'] = (
            Object.values(typedValue.lighthouseResult?.categories || {}) as LighthouseCategoryV5[]
        ).reduce((acc: TransformedPageSpeedData['audits'], category) => {
            const filteredAudits = category.auditRefs
                ?.map((auditRef) => {
                    const audit = auditValues.find((a) => a.id === auditRef.id);
                    const scoreAsNumber = parseInt(audit?.score);

                    if (!audit || isNaN(scoreAsNumber) || scoreAsNumber === 1) return null;

                    return audit;
                })
                .filter((audit): audit is LighthouseAuditResultV5 => Boolean(audit))
                .toSorted((a, b) => {
                    const aScoreStatus = getScoreStatus(a.score * 100);
                    const bScoreStatus = getScoreStatus(b.score * 100);

                    return (
                        PAGE_SPEED_INSIGHT_STATUS_PRIORTY[aScoreStatus] -
                        PAGE_SPEED_INSIGHT_STATUS_PRIORTY[bScoreStatus]
                    );
                });

            if (filteredAudits?.length) {
                acc.push({
                    category,
                    results: filteredAudits,
                });
            }

            return acc;
        }, []);

        if (typedValue.lighthouseResult?.categories)
            transformedData[category].categories = typedValue.lighthouseResult?.categories;

        return transformedData;
    }, {});

export const detectDataType = (data: any): AnyDetectedDataResult => {
    return DATA_TYPES_WITH_SCHEMAS.reduce(
        (result: AnyDetectedDataResult, { type, schema }) => {
            const validatedData = schema.safeParse(data);

            if (validatedData.success) result = { type, data: validatedData.data };

            return result;
        },
        { type: 'unknown', data },
    );
};

export const renderAnyObject = (configs: RenderConfig[], value: Record<string, unknown>): ReactNode[] => {
    return Object.entries(value).map(([key, value]) => {
        const renderConfig = configs.find((config) => config.key === key);

        return renderConfig ? renderConfig.render(value) : null;
    });
};
