import { Status } from '@/enums';
import DetailsItem from '../DetailsItem';
import type { WhoIsResult } from '@/types';

type WhoIsProps = {
    analyzeResult: WhoIsResult;
};

export default function WhoIs({ analyzeResult }: WhoIsProps) {
    if (analyzeResult.status === Status.Err) return <div>Error at Who Is Service</div>;

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
                    <DetailsItem data={{ name: 'Name', value: analyzeResult.data.idnName }} />
                    <DetailsItem data={{ name: 'Created At', value: analyzeResult.data.created }} />
                    <DetailsItem data={{ name: 'Changed At', value: analyzeResult.data.changed }} />
                    <DetailsItem data={{ name: 'Expires At', value: analyzeResult.data.expires }} />
                    <DetailsItem data={{ name: 'IPs', value: analyzeResult.data.ips }} />
                    {analyzeResult.data.nameserver?.length && (
                        <DetailsItem data={{ name: 'Servers', value: analyzeResult.data.nameserver.join(', ') }} />
                    )}
                </section>
                {analyzeResult.data.contacts.owner && analyzeResult.data.contacts.owner.length > 0 && (
                    <section aria-describedby="owner">
                        <h3
                            id="owner"
                            className="mt-2 border-b-2 text-2xl font-bold"
                        >
                            OWNER
                        </h3>
                        {Object.entries(analyzeResult.data.contacts.owner[0])
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
