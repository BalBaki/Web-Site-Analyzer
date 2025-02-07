import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const stringifyObjectValues = <T extends Record<string, unknown>>(payload: T): Record<keyof T, string> =>
    Object.fromEntries(
        Object.entries(payload).map(([key, value]) => [
            key,
            !value ? '' : typeof value === 'object' ? JSON.stringify(value) : String(value),
        ])
    ) as Record<keyof T, string>;
