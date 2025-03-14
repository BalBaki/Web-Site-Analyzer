import type { PagespeedApiPagespeedResponseV5 } from '@/types';

type PageSpeedInsightTabProps = {
    data: PagespeedApiPagespeedResponseV5;
};

export default function PageSpeedInsightTab({ data }: PageSpeedInsightTabProps) {
    return <div>{data.lighthouseResult?.environment?.networkUserAgent}</div>;
}
