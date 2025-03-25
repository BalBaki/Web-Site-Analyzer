import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';
import type { AccessibilityViolation, ImpactSeverity, ScoreStatus } from '@/types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const stringifyObjectValues = <T extends Record<string, unknown>>(payload: T): Record<keyof T, string> =>
    Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [
            key,
            value === null || value === undefined
                ? ''
                : typeof value === 'object'
                  ? value instanceof Date
                      ? value.toISOString()
                      : JSON.stringify(value)
                  : String(value),
        ]),
    ) as Record<keyof T, string>;

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
    return {
        isPass: score >= 90 && score <= 100,
        isAverage: score >= 50 && score <= 89,
        isFail: score >= 0 && score <= 49,
    };
};
