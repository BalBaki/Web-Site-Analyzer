'use client';

import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import analyzer from '@/services/analyzer.service';
import type { AssistantPayload } from '@/types';

type AssistantProps = {
    data: AssistantPayload;
};

export default function Assistant({ data }: AssistantProps) {
    const {
        data: result,
        error,
        isPending,
        mutate: ask,
    } = useMutation({
        mutationFn: analyzer.assistant,
    });
    const handleAskClick = () => {
        ask(data);
    };

    if (error || (result && !result.assistant))
        return (
            <div>
                <span>Something went wrong..!</span>
                <Button
                    className="my-2"
                    disabled={isPending}
                    aria-label={isPending ? 'Asking again' : 'Try Again'}
                    onClick={handleAskClick}
                >
                    {isPending ? 'Asking' : 'Try Again'}
                </Button>
            </div>
        );

    return (
        <div>
            {!result ? (
                <Button
                    className="my-2 w-44"
                    disabled={isPending}
                    aria-label={isPending ? 'Asking' : 'Ask for help'}
                    onClick={handleAskClick}
                >
                    {isPending ? 'Asking' : 'How Can I fix It? Ask AI.'}
                </Button>
            ) : (
                <div>Answer: {result.answer}</div>
            )}
        </div>
    );
}
