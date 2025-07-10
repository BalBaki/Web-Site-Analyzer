'use client';

import { useEffect, useReducer } from 'react';
import { stringifyObjectValues } from '@/lib/utils';
import { clientEnv } from '@/services/env/client';
import type { Analyze, AnalyzeSearchParams, ServiceEvent, StartOrCompleteEvent, StreamEvent } from '@/types';

type AnalysisStream = {
    events: StreamEvent[];
    error: string | null;
    isLoading: boolean;
    result: Analyze | undefined;
};
type Action =
    | { type: 'START' }
    | { type: 'ADD_STREAM_EVENT'; payload: StreamEvent }
    | { type: 'SET_ERROR'; payload: string }
    | { type: 'ADD_RESULT'; payload: Analyze }
    | { type: 'RESET' }
    | { type: 'END' };

const initialAnalysisStream: AnalysisStream = { events: [], error: null, isLoading: false, result: undefined };
const reducer = (state: AnalysisStream, action: Action): AnalysisStream => {
    switch (action.type) {
        case 'START':
            return { ...state, isLoading: true, error: null };
        case 'ADD_STREAM_EVENT':
            return { ...state, events: [...state.events, action.payload] };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isLoading: false };
        case 'ADD_RESULT':
            return { ...state, result: { ...state.result, ...action.payload } };
        case 'RESET':
            return initialAnalysisStream;
        case 'END':
            return { ...state, isLoading: false };
        default:
            return state;
    }
};

export const useAnalysisStream = (payload: AnalyzeSearchParams) => {
    const [analysisStream, dispatch] = useReducer(reducer, initialAnalysisStream);

    useEffect(() => {
        dispatch({ type: 'START' });

        const eventSource = new EventSource(
            clientEnv.apiUrl + 'analyze-stream?' + new URLSearchParams(stringifyObjectValues(payload)),
        );

        eventSource.addEventListener('service', (event) => {
            const parsedEvent = JSON.parse(event.data) as ServiceEvent;

            switch (parsedEvent.streamData.stage) {
                case 'complete_tool':
                case 'tool_error':
                    dispatch({
                        type: 'ADD_RESULT',
                        payload: { [parsedEvent.service]: (parsedEvent.streamData as any).result },
                    });

                    break;
                default:
                    break;
            }

            dispatch({ type: 'ADD_STREAM_EVENT', payload: parsedEvent });
        });
        eventSource.addEventListener('start', (event) => {
            const parsedEvent = JSON.parse(event.data) as StartOrCompleteEvent;

            dispatch({ type: 'ADD_STREAM_EVENT', payload: parsedEvent });
        });

        eventSource.addEventListener('complete', (event) => {
            const parsedEvent = JSON.parse(event.data) as StartOrCompleteEvent;

            dispatch({ type: 'ADD_STREAM_EVENT', payload: parsedEvent });

            eventSource.close();

            setTimeout(() => {
                dispatch({ type: 'END' });
            }, 1000);
        });

        eventSource.onerror = () => {
            eventSource.close();

            dispatch({ type: 'SET_ERROR', payload: 'Something went wrong..!' });
        };

        return () => {
            eventSource.close();
        };
    }, [payload]);

    return analysisStream;
};
