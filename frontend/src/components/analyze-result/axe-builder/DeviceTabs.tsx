'use client';

import { useAxeBuilderContext } from '.';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Device } from '@/types';

const devices: Device[] = ['desktop', 'mobile', 'tablet'];

export default function DeviceTabs() {
    const { setDevice, device: selectedDevice } = useAxeBuilderContext();

    return (
        <div
            className="bg-muted text-muted-foreground inline-flex w-full flex-wrap items-center justify-normal gap-y-1.5 rounded-lg p-[3px]"
            role="tablist"
            aria-orientation="horizontal"
            tabIndex={0}
        >
            {devices.map((device) => {
                return (
                    <Button
                        key={device}
                        aria-selected={device === selectedDevice}
                        role="tab"
                        tabIndex={-1}
                        onClick={() => setDevice(device)}
                        className={cn(
                            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 cursor-auto gap-1.5 rounded-md border border-transparent bg-inherit px-2 py-1 text-sm font-medium whitespace-nowrap capitalize transition-[color,box-shadow] hover:bg-inherit focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50',
                            {
                                'bg-background! dark:text-foreground dark:border-input dark:bg-input/30 shadow-sm':
                                    device === selectedDevice,
                            },
                        )}
                    >
                        {device}
                    </Button>
                );
            })}
        </div>
    );
}
