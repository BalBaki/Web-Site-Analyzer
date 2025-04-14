import DetailsItem from '../DetailsItem';
import type { WhoIsResponse } from '@/types';

type WhoIsProps = {
    analyzeResult: WhoIsResponse;
};

export default function WhoIs({ analyzeResult }: WhoIsProps) {
    if ('error' in analyzeResult) return <div>Error at Who Is Service</div>;

    return (
        <dl>
            <h3 className="border-b-2 text-2xl font-bold">DOMAIN</h3>
            <DetailsItem data={{ name: 'Name', value: analyzeResult.idnName }} />
            <DetailsItem data={{ name: 'Created At', value: analyzeResult.created }} />
            <DetailsItem data={{ name: 'Changed At', value: analyzeResult.changed }} />
            <DetailsItem data={{ name: 'Expires At At', value: analyzeResult.expires }} />
            <DetailsItem data={{ name: 'IPs', value: analyzeResult.ips }} />
            <DetailsItem data={{ name: 'Servers', value: analyzeResult.nameserver.join(', ') }} />
            {analyzeResult.contacts.owner && analyzeResult.contacts.owner.length > 0 && (
                <>
                    <h3 className="mt-2 border-b-2 text-2xl font-bold">OWNER</h3>

                    {Object.entries(analyzeResult.contacts.owner[0])
                        .filter(([, value]) => Boolean(value))
                        .map(([key, value]) => {
                            return (
                                <DetailsItem
                                    key={key}
                                    data={{ name: key, value: Array.isArray(value) ? value.join(' ') : value }}
                                />
                            );
                        })}
                </>
            )}
        </dl>
    );
}
