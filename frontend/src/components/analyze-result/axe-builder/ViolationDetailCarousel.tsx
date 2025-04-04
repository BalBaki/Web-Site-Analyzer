'use client';

import { useEffect, useState } from 'react';
import ViolationDetail from './ViolationDetail';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../ui/carousel';
import type { AccessibilityViolation } from '@/types';
import type { CarouselApi } from '../../ui/carousel';

type ViolationDetailCarouselProps = {
    violation: AccessibilityViolation;
};

export default function ViolationDetailCarousel({ violation }: ViolationDetailCarouselProps) {
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
                {violation.nodes.map((node, index) => {
                    return (
                        <CarouselItem key={index}>
                            <ViolationDetail data={{ node, violation }} />
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
}
