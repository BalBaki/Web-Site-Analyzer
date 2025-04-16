import DetailsItem from '../DetailsItem';
import type { WhoIsResponse } from '@/types';

type WhoIsProps = {
    analyzeResult: WhoIsResponse;
};

export default function WhoIs({ analyzeResult }: WhoIsProps) {
    if ('error' in analyzeResult) return <div>Error at Who Is Service</div>;

    return (
        <>
            <h2 className="sr-only">Who Is Service Result</h2>
            <dl>
                <section aria-describedby="domain">
                    <h3
                        id="domain"
                        className="border-b-2 text-2xl font-bold"
                    >
                        DOMAIN
                    </h3>
                    <DetailsItem data={{ name: 'Name', value: analyzeResult.idnName }} />
                    <DetailsItem data={{ name: 'Created At', value: analyzeResult.created }} />
                    <DetailsItem data={{ name: 'Changed At', value: analyzeResult.changed }} />
                    <DetailsItem data={{ name: 'Expires At', value: analyzeResult.expires }} />
                    <DetailsItem data={{ name: 'IPs', value: analyzeResult.ips }} />
                    <DetailsItem data={{ name: 'Servers', value: analyzeResult.nameserver.join(', ') }} />
                </section>
                {analyzeResult.contacts.owner && analyzeResult.contacts.owner.length > 0 && (
                    <section aria-describedby="owner">
                        <h3
                            id="owner"
                            className="mt-2 border-b-2 text-2xl font-bold"
                        >
                            OWNER
                        </h3>
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
                    </section>
                )}
            </dl>
        </>
    );
}
