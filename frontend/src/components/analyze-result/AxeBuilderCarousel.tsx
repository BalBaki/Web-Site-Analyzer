'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { AccessibilityViolation } from '@/types';
import Assistant from '../Assistant';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import type { CarouselApi } from '../ui/carousel';

type AxeBuilderCarouselProps = {
    result: AccessibilityViolation[];
};

export default function AxeBuilderCarousel({ result }: AxeBuilderCarouselProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    return (
        <Carousel setApi={setApi}>
            {count > 1 && (
                <div className="mr-2 ml-auto flex items-center gap-1">
                    <div className="ml-auto">
                        {current} of {count}
                    </div>
                    <CarouselPrevious className="static translate-x-0 translate-y-0" />
                    <CarouselNext className="static translate-x-0 translate-y-0" />
                </div>
            )}
            <CarouselContent>
                {result.map((err, index) => {
                    return (
                        <Fragment key={index}>
                            {err.nodes.map((node, _index) => {
                                return (
                                    <CarouselItem key={_index}>
                                        <div>
                                            Impact :{' '}
                                            <span
                                                className={cn('capitalize', {
                                                    'text-[hsl(var(--chart-1))]': node.impact === 'critical',
                                                    'text-[hsl(var(--chart-2))]': node.impact === 'serious',
                                                    'text-[hsl(var(--chart-3))]': node.impact === 'moderate',
                                                    'text-[hsl(var(--chart-4))]': node.impact === 'minor',
                                                    'text-[hsl(var(--chart-5))]': node.impact === 'trivial',
                                                })}
                                            >
                                                {node.impact}
                                            </span>
                                        </div>
                                        <div>HTML : {node.html}</div>
                                        <div>Selector: {node.target}</div>
                                        <div>Description: {err.description}</div>
                                        <div>Help: {err.help}</div>
                                        <div>
                                            Help URL:
                                            <Link
                                                href={err.helpUrl}
                                                target="_blank"
                                                className="ml-1 underline"
                                            >
                                                {err.helpUrl}
                                            </Link>
                                        </div>
                                        {node.all.length > 0 && (
                                            <>
                                                <div>Message: {`${node.all[0].message}`}</div>
                                                {node.all[0].data?.contrastRatio >= 0 && (
                                                    <div>Current Ratio: {node.all[0].data.contrastRatio}</div>
                                                )}
                                                {node.all[0].data?.expectedContrastRatio && (
                                                    <div>Expected Ratio: {node.all[0].data.expectedContrastRatio}</div>
                                                )}
                                            </>
                                        )}
                                        <Assistant
                                            data={{
                                                type: 'acccessbility',
                                                description: err.description,
                                                elementHtml: node.html,
                                            }}
                                        />
                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <Badge className="capitalize">{node.impact}</Badge>
                                            {err.tags.map((tag) => (
                                                <Badge key={tag}>{tag}</Badge>
                                            ))}
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </Fragment>
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
}
