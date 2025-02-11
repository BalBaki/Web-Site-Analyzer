'use client';

import { Result } from '@/types';
import { Fragment, useEffect, useState } from 'react';
import {
    Carousel,
    CarouselPrevious,
    CarouselNext,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from '../ui/carousel';
import { Badge } from '@/components/ui/badge';

type AxeBuilderCarouselProps = {
    result: Result[];
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
                <div className="flex ml-auto mr-2 items-center gap-1">
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
                                            Impact : <span className="capitalize text-red-500"> {node.impact}</span>
                                        </div>
                                        <div>HTML : {node.html}</div>
                                        <div>Selector: {node.target}</div>
                                        <div>Description: {err.description}</div>
                                        <div>Help: {err.help}</div>
                                        <div>Help URL: {err.helpUrl}</div>
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
                                        <div className="flex items-center flex-wrap gap-2 mt-1">
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
