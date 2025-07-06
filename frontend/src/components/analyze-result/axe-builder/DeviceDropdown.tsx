'use client';

import { useState } from 'react';
import { useAxeBuilderContext } from '.';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Device } from '@/types';

const devices: Device[] = ['desktop', 'mobile', 'tablet'];

export default function DeviceDropdown() {
    const { setDevice, device: selectedDevice } = useAxeBuilderContext();
    const [open, setOpen] = useState(false);

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    aria-label={`Select device, currently ${selectedDevice}`}
                    className="justify-between pl-2 capitalize sm:w-30 sm:max-w-(--breakpoint-sm)"
                >
                    {selectedDevice}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="popover-content-width-same-as-its-trigger! p-0">
                <Command>
                    <CommandList>
                        <CommandGroup>
                            {devices.map((device) => (
                                <CommandItem
                                    key={device}
                                    className="capitalize"
                                    value={device}
                                    disabled={device === selectedDevice}
                                    onSelect={(currentValue) => {
                                        if (currentValue === selectedDevice) return;

                                        setDevice(currentValue as Device);
                                        setOpen(false);
                                    }}
                                >
                                    {device}
                                    {device === selectedDevice && <Check className="text-selected-tab ml-auto" />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
