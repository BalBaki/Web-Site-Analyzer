'use client';

import * as motion from 'motion/react-client';
import Link from 'next/link';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiCheck } from 'react-icons/bi';
import { FiPlay, FiXCircle } from 'react-icons/fi';
import { capitilizeFirstLetter, truncateTextMiddle } from '@/lib/utils';
import { StreamEventService } from '@/services/stream-event.service';
import type { ServiceEvent, StreamEvent } from '@/types';

type AnalysisProgressLogProps = {
    events: StreamEvent[];
};

const renderServiceEventMessage = (event: ServiceEvent): React.ReactNode => {
    const capitalizedService = capitilizeFirstLetter(event.service);

    switch (event.streamData.stage) {
        case 'link_extraction':
            return 'Link extraction has started.';
        case 'link_extraction_complete':
            return (
                <div className="flex flex-col">
                    <span>The link extraction has completed</span>
                    <span className="text-progress-log text-sm">{`Found ${event.streamData.urls.length} URLs to analyze`}</span>
                </div>
            );
        case 'start_tool':
            return `The ${capitalizedService} tool's analysis has started.`;
        case 'complete_tool':
            return `The ${capitalizedService} tool's analysis has ended.`;
        case 'tool_error':
            return `An error occurred while the ${capitalizedService} tool was analyzing.`;
        case 'url_processing':
            return (
                <div className="flex flex-col">
                    {`Analyzing URL ${event.streamData.urlIndex} of ${event.streamData.totalUrls} `}
                    <Link
                        href={event.streamData.currentUrl}
                        target="_blank"
                        className="text-progress-log text-sm break-all underline"
                    >
                        {truncateTextMiddle(event.streamData.currentUrl, { start: 60, end: 10 })}
                    </Link>
                </div>
            );
        case 'url_process_complete':
            return (
                <div className="flex flex-col">
                    {'Analysis complete for:'}
                    <Link
                        href={event.streamData.currentUrl}
                        target="_blank"
                        className="text-progress-log text-sm break-all underline"
                    >
                        {truncateTextMiddle(event.streamData.currentUrl, { start: 60, end: 10 })}
                    </Link>
                </div>
            );

        default:
            return event.message;
    }
};
const renderStreamEventMessage = (event: StreamEvent): React.ReactNode => {
    switch (event.type) {
        case 'start':
            return 'Analysis has started';
        case 'complete':
            return "All tools' analysis have completed.";
        case 'error':
            return 'An error occurred while analyzing.';
        case 'service':
            return renderServiceEventMessage(event);
    }
};
const getStatusIcon = (event: StreamEvent) => {
    const status = StreamEventService.getStatus(event);

    switch (status) {
        case 'start':
            return <FiPlay className="size-6 shrink-0 animate-pulse" />;
        case 'analyzing':
            return <AiOutlineLoading3Quarters className="size-5 shrink-0 animate-spin" />;
        case 'error':
            return <FiXCircle className="text-score-fail size-6 shrink-0" />;
        case 'completed':
            return <BiCheck className="bg-score-pass size-6 shrink-0 rounded-full fill-white p-1" />;
        default:
            return null;
    }
};

export default function AnalysisProgressLog({ events }: AnalysisProgressLogProps) {
    return (
        <div
            className="divide-y-2"
            role="list"
        >
            {events.map((event, index) => {
                return (
                    <motion.div
                        role="listitem"
                        initial={{ y: '20px', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        key={index}
                        className="flex items-center gap-3 p-3"
                    >
                        {getStatusIcon(event)}
                        <div className="flex flex-col">{renderStreamEventMessage(event)}</div>
                        <span className="ml-auto shrink-0 text-xs">
                            {new Date(event.timestamp).toLocaleTimeString()}
                        </span>
                    </motion.div>
                );
            })}
        </div>
    );
}
