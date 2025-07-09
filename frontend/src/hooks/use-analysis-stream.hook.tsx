/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { stringifyObjectValues } from '@/lib/utils';
import { clientEnv } from '@/services/env/client';
import type { Analyze, AnalyzeSearchParams, ServiceEvent, StartOrCompleteEvent, StreamEvent } from '@/types';

export const useAnalysisStream = (payload: AnalyzeSearchParams) => {
    const [streamEvents, setStreamEvents] = useState<StreamEvent[]>([]);
    const [error, setError] = useState<string | null>();
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<Analyze>();

    useEffect(() => {
        setIsLoading(true);

        const eventSource = new EventSource(
            clientEnv.apiUrl + '/analyze-stream?' + new URLSearchParams(stringifyObjectValues(payload)),
        );

        eventSource.addEventListener('service', (event) => {
            const parsed = JSON.parse(event.data) as ServiceEvent;

            switch (parsed.streamData.stage) {
                case 'complete_tool':
                    setResult((prev) => ({
                        ...prev,
                        [parsed.service]: (parsed.streamData as any).result,
                    }));

                    break;
                case 'tool_error': {
                    setResult((prev) => ({
                        ...prev,
                        [parsed.service]: (parsed.streamData as any).result,
                    }));
                }
                default:
                    break;
            }

            setStreamEvents((prev) => [...prev, parsed]);
        });
        eventSource.addEventListener('start', (event) => {
            const parsed = JSON.parse(event.data) as StartOrCompleteEvent;

            setStreamEvents((prev) => [...prev, parsed]);
        });

        eventSource.addEventListener('complete', (event) => {
            const parsed = JSON.parse(event.data) as StartOrCompleteEvent;

            setStreamEvents((prev) => [...prev, parsed]);

            eventSource.close();

            setTimeout(() => {
                setIsLoading(false);
            }, 1000);
        });

        eventSource.onerror = () => {
            console.log('An error occurred while attempting to connect.');

            eventSource.close();

            setError('Something went wrong..!');

            setIsLoading(false);
        };

        return () => {
            eventSource.close();
        };
    }, [payload]);

    return { streamEvents, result, error, isLoading };
};
