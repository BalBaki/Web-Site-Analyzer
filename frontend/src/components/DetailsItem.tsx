/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { cn, stringifyValue, truncateTextMiddle } from '@/lib/utils';
import type { ComponentPropsWithRef } from 'react';

type ItemData = { name: string; value: any; seperator?: string };
type BaseConfigProps = {
    wrapper?: ComponentPropsWithRef<'div'>;
    name?: ComponentPropsWithRef<'dt'>;
    seperator?: ComponentPropsWithRef<'span'>;
    value?: ComponentPropsWithRef<'dd'>;
};

type DetailsItemProps =
    | {
          data: ItemData;
          isLink?: false;
          config?: BaseConfigProps & { link?: never };
          truncateMiddle?: boolean;
      }
    | {
          data: ItemData;
          isLink: true;
          config?: BaseConfigProps & { link?: Omit<ComponentPropsWithRef<typeof Link>, 'href'> };
          truncateMiddle?: boolean;
      };

export default function DetailsItem({
    data: { name, value, seperator = ':' },
    isLink = false,
    truncateMiddle = false,
    config = {},
}: DetailsItemProps) {
    const stringifiedValue = stringifyValue(value);
    const { className: wrapperClassName, ...otherWrapperProps } = config.wrapper || {};
    const { className: nameClassName, ...otherNameProps } = config.name || {};
    const { className: seperatorClassName, ...otherSeperatorProps } = config.seperator || {};
    const { className: valueClassName, ...otherValueProps } = config.value || {};
    const { className: linkClassName, ...otherLinkProps } = config.link || {};
    const text = truncateMiddle ? truncateTextMiddle(stringifiedValue) : stringifiedValue;

    return (
        <div
            className={cn('break-all', wrapperClassName)}
            {...otherWrapperProps}
        >
            <div className="float-left flex">
                <dt
                    className={cn(
                        'shrink-0 font-semibold text-[#8B4513] capitalize dark:text-[#D2B48C]',
                        nameClassName,
                    )}
                    {...otherNameProps}
                >
                    {name}
                </dt>
                <span
                    className={cn('mx-1 shrink-0 font-semibold', seperatorClassName)}
                    {...otherSeperatorProps}
                >
                    {seperator}
                </span>
            </div>
            <dd
                className={cn(valueClassName)}
                {...otherValueProps}
            >
                {isLink ? (
                    <Link
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(linkClassName)}
                        {...otherLinkProps}
                    >
                        {text}
                    </Link>
                ) : (
                    text
                )}
            </dd>
        </div>
    );
}
