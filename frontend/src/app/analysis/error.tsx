'use client';

type AnalysisErrorProps = {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
};

export default function AnalysisError({ reset }: AnalysisErrorProps) {
    return (
        <div>
            <h2>Something went wrong!</h2>
            <button onClick={() => reset()}>Try again</button>
        </div>
    );
}
