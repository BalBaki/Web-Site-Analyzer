'use client';

import { useMutation } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Status } from '@/enums';
import apiService from '@/services/api.service';
import type { AskPayload } from '@/types';

type AssistantProps = {
    data: AskPayload;
};

export default function Assistant({ data }: AssistantProps) {
    const {
        data: result,
        error,
        isPending,
        mutate: ask,
    } = useMutation({
        mutationFn: apiService.ask,
    });
    const handleAskClick = () => {
        ask(data);
    };

    if (error || result?.status === Status.Err)
        return (
            <div>
                <span>Something went wrong..!</span>
                <Button
                    className="my-2 ml-1"
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
                <div>Answer: {result.data.answer}</div>
            )}
        </div>
    );
}
