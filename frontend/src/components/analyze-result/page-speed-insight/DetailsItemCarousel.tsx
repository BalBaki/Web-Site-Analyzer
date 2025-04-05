'use client';

import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../ui/carousel';
import type { ReactNode } from 'react';
import type { CarouselApi } from '../../ui/carousel';

type DetailsItemCarouselProps = { renderedData: ReactNode[] };

export default function DetailsItemCarousel({ renderedData }: DetailsItemCarouselProps) {
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
            <div className="mr-2 ml-auto flex items-center gap-1">
                <div className="ml-auto">
                    {current} of {count}
                </div>
                <CarouselPrevious className="static translate-x-0 translate-y-0" />
                <CarouselNext className="static translate-x-0 translate-y-0" />
            </div>
            <CarouselContent>
                {renderedData.map((value, index) => (
                    <CarouselItem key={index}>{value}</CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
