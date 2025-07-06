import { cn } from '@/lib/utils';
import type { ComponentPropsWithRef } from 'react';

type ProgressCircleProps = {
    percentage: number;
    progressStickThickness?: number;
    config?: {
        wrapper?: ComponentPropsWithRef<'div'>;
        svg?: ComponentPropsWithRef<'svg'>;
        circle?: Omit<ComponentPropsWithRef<'circle'>, 'strokeWidth'>;
        progressStick?: Omit<ComponentPropsWithRef<'circle'>, 'strokeDasharray' | 'strokeWidth'>;
        text?: ComponentPropsWithRef<'span'>;
    };
};

export default function ProgressCircle({ percentage, progressStickThickness = 8, config = {} }: ProgressCircleProps) {
    const { className: wrapperClassName, ...wrapperProps } = config.wrapper || {};
    const { className: svgClassName, ...svgProps } = config.svg || {};
    const { className: circleClassName, ...circleProps } = config.circle || {};
    const { className: progressStickClassName, ...progressStickProps } = config.progressStick || {};
    const { className: textClassName, ...textProps } = config.text || {};
    const strokeDasharray = 289;

    return (
        <div
            className={cn('relative aspect-square w-24', wrapperClassName)}
            {...wrapperProps}
        >
            <svg
                viewBox="0 0 100 100"
                className={cn('absolute inset-0 -rotate-90 transform rounded-full', svgClassName)}
                {...svgProps}
            >
                <circle
                    cx="50"
                    cy="50"
                    r="46"
                    strokeWidth={progressStickThickness}
                    className={cn('stroke-current text-white dark:text-gray-200', circleClassName)}
                    fill="none"
                    {...circleProps}
                />
                <circle
                    cx="50"
                    cy="50"
                    r="46"
                    strokeWidth={progressStickThickness}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDasharray - (percentage / 100) * strokeDasharray}
                    className={cn('animate-load-progress-circle stroke-current', progressStickClassName)}
                    fill="none"
                    {...progressStickProps}
                />
            </svg>
            <span
                className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-white',
                    textClassName,
                )}
                {...textProps}
            >
                {percentage}
            </span>
        </div>
    );
}
