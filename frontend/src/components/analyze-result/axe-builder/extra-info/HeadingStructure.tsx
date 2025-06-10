'use client';

import { useAxeBuilderContext } from '..';
import Image from 'next/image';
import { FaEyeLowVision } from 'react-icons/fa6';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Status } from '@/enums';
import { extractHeadingLevel } from '@/lib/utils';

export default function HeadingStructure() {
    const { selectedReport } = useAxeBuilderContext();

    if (!selectedReport || selectedReport.status === Status.Err) return null;

    return (
        <section
            aria-labelledby="heading-structure"
            className="overflow-y-auto"
        >
            <h3
                id="heading-structure"
                className="m-3 text-3xl font-semibold"
            >
                Heading Structure
            </h3>
            <div
                className="space-y-2 px-3 py-1"
                role="list"
                aria-label="Document heading hierarchy"
            >
                {selectedReport.data.headingTree.length > 0 ? (
                    selectedReport.data.headingTree.map((heading, index, arr) => {
                        const headingLevelAsNumber = extractHeadingLevel(heading.level);

                        return (
                            <div
                                key={heading.level + index}
                                style={
                                    headingLevelAsNumber <= 1
                                        ? undefined
                                        : {
                                              paddingLeft: `${(headingLevelAsNumber - 1) * 0.5}rem`,
                                          }
                                }
                                className="relative flex items-center"
                                role="listitem"
                            >
                                <span className="relative mr-1 flex size-9 shrink-0 items-center justify-center rounded-full border-3 border-black bg-blue-600 font-semibold text-white dark:border-white">
                                    {heading.srOnly && (
                                        <FaEyeLowVision
                                            className="absolute inset-0 z-50 size-full opacity-40"
                                            aria-label="Screen reader only"
                                            title="This heading is only visible to screen readers"
                                            color="red"
                                        />
                                    )}
                                    {heading.level}
                                </span>
                                {index > 0 && headingLevelAsNumber - extractHeadingLevel(arr[index - 1].level) > 1 && (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="shrink-0">
                                                <Image
                                                    src="/assets/heading_skipped.svg"
                                                    alt="Heading level is skipped"
                                                    width={36}
                                                    height={36}
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>Heading level is skipped</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                <p
                                    className="line-clamp-1"
                                    title={heading.text}
                                >
                                    {heading.text}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p className="p-4 text-center text-gray-500">No heading is found in page</p>
                )}
            </div>
        </section>
    );
}
