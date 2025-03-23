import type { WhoIsResponse } from '@/types';

type WhoIsProps = {
    analyzeResult: WhoIsResponse;
};

export default function WhoIs({ analyzeResult }: WhoIsProps) {
    if ('error' in analyzeResult) return <div>Error at Who Is</div>;

    return (
        <div>
            <h3 className="border-b-2 text-2xl font-bold">DOMAIN</h3>
            <div className="flex">
                <h3 className="font-semibold">Name</h3>
                <span>:</span>
                <p className="ml-1">{analyzeResult.idnName}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">Created At</h3>
                <span>:</span>
                <p className="ml-1">{analyzeResult.created}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">Changed At</h3>
                <span>:</span>
                <p className="ml-1">{analyzeResult.changed}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">Expires At</h3>
                <span>:</span>
                <p className="ml-1">{analyzeResult.expires}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">IPs</h3>
                <span>:</span>
                <p className="ml-1">{analyzeResult.ips}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold"> Servers</h3>
                <span>:</span>
                <p className="ml-1">{analyzeResult.nameserver.join(', ')}</p>
            </div>
            {analyzeResult.contacts.owner && analyzeResult.contacts.owner.length > 0 && (
                <div>
                    <h2 className="mt-2 border-b-2 text-2xl font-bold">OWNER</h2>
                    <div>
                        {Object.entries(analyzeResult.contacts.owner[0])
                            .filter(([, value]) => Boolean(value))
                            .map(([key, value]) => {
                                return (
                                    <div
                                        key={key}
                                        className="flex"
                                    >
                                        <h3 className="font-semibold capitalize">{key}</h3>
                                        <span>:</span>
                                        <p className="ml-1 break-all">{value}</p>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
}
