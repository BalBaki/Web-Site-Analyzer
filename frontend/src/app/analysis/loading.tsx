import Image from 'next/image';

export default function AnalysisPageLoading() {
    return (
        <div className="absolute top-1/2 left-1/2 flex w-fit -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
            <Image
                src="/assets/analyze.gif"
                alt="Analyzing"
                width={128}
                height={128}
                unoptimized
            />
            <p className="mt-4 w-max text-lg font-medium">Analyzing, please wait...</p>
        </div>
    );
}
