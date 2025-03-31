import Link from 'next/link';
import { stringifyValue } from '@/lib/utils';

type PageSpeedInsightDetailsItemProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: { name: string; value: any };
    isLink?: boolean;
};

export default function PageSpeedInsightDetailsItem({
    data: { name, value },
    isLink = false,
}: PageSpeedInsightDetailsItemProps) {
    const stringifiedValue = stringifyValue(value);

    return (
        <div className="flex">
            <dt className="shrink-0">{name}</dt>
            <span className="mx-1">:</span>
            <dd>
                {isLink ? (
                    <Link
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
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
