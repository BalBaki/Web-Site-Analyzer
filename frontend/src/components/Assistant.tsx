'use client';

import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import type { AssistantPayload, AssistantResponse } from '@/types';

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
        mutationFn: async (payload: AssistantPayload): Promise<AssistantResponse> => {
            const response = await fetch('api/assistant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) return { assistant: false, error: 'Something went wrong..!' };

            return (await response.json()) as AssistantResponse;
        },
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
