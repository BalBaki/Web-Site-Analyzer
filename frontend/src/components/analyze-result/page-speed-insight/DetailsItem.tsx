/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { cn, stringifyValue } from '@/lib/utils';
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
      }
    | {
          data: ItemData;
          isLink: true;
          config?: BaseConfigProps & { link?: Omit<ComponentPropsWithRef<typeof Link>, 'href'> };
      };

export default function DetailsItem({
    data: { name, value, seperator = ':' },
    isLink = false,
    config = {},
}: DetailsItemProps) {
    const stringifiedValue = stringifyValue(value);
    const { className: wrapperClassName, ...otherWrapperProps } = config.wrapper || {};
    const { className: nameClassName, ...otherNameProps } = config.name || {};
    const { className: seperatorClassName, ...otherSeperatorProps } = config.seperator || {};
    const { className: valueClassName, ...otherValueProps } = config.value || {};
    const { className: linkClassName, ...otherLinkProps } = config.link || {};

    return (
        <div
            className={cn('flex', wrapperClassName)}
            {...otherWrapperProps}
        >
            <dt
                className={cn('shrink-0', nameClassName)}
                {...otherNameProps}
            >
                {name}
            </dt>
            <span
                className={cn('mx-1', seperatorClassName)}
                {...otherSeperatorProps}
            >
                {seperator}
            </span>
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
                        {stringifiedValue}
                    </Link>
                ) : (
                    stringifiedValue
                )}
            </dd>
        </div>
    );
}
