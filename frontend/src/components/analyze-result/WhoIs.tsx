import type { WhoisResult } from '@/types';

type WhoIsProps = {
    result: WhoisResult;
};

export default function WhoIs({ result }: WhoIsProps) {
    return (
        <div>
            <h3 className="text-2xl font-bold border-b-2">DOMAIN</h3>
            <div className="flex">
                <h3 className="font-semibold">Name</h3>
                <span>:</span>
                <p className="ml-1">{result.idnName}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">Created At</h3>
                <span>:</span>
                <p className="ml-1">{result.created}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">Changed At</h3>
                <span>:</span>
                <p className="ml-1">{result.changed}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">Expires At</h3>
                <span>:</span>
                <p className="ml-1">{result.expires}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold">IPs</h3>
                <span>:</span>
                <p className="ml-1">{result.ips}</p>
            </div>
            <div className="flex">
                <h3 className="font-semibold"> Servers</h3>
                <span>:</span>
                <p className="ml-1">{result.nameserver.join(', ')}</p>
            </div>
            <div>
                <h2 className="text-2xl font-bold border-b-2 mt-2">OWNER</h2>
                <div>
                    {Object.entries(result.contacts.owner[0])
                        .filter(([, value]) => value)
                        .map(([key, value]) => {
                            return (
                                <div
                                    key={key}
                                    className="flex"
                                >
                                    <h3 className="capitalize font-semibold">{key}</h3>
                                    <span>:</span>
                                    <p className="ml-1">{value}</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
