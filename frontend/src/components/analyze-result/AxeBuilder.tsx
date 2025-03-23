'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import AxeBuilderItem from './AxeBuilderItem';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { AxeBuilderResponse } from '@/types';

type AxeBuilderProps = {
    analyzeResult: AxeBuilderResponse;
    defaultUrl: string;
};

export default function AxeBuilder({ analyzeResult, defaultUrl }: AxeBuilderProps) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState(defaultUrl);

    if ('error' in analyzeResult) return <div>Error at AxeBuilder</div>;

    //TODO Add useMemo
    const selectedReport = analyzeResult.find((result) => result.url === url);

    return (
        <section>
            <Popover
                open={open}
                onOpenChange={setOpen}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="mb-2 w-full justify-between sm:max-w-(--breakpoint-sm)"
                    >
                        {url ? analyzeResult.find((result) => result.url === url)?.url : 'Enter Valid URL..!'}
                        {/* <ChevronsUpDown className="opacity-50" /> */}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="popover-content-width-same-as-its-trigger! p-0">
                    <Command>
                        <CommandInput
                            placeholder="Search Url"
                            className="h-9"
                        />
                        <CommandList>
                            <CommandEmpty>No Url found.</CommandEmpty>
                            <CommandGroup>
                                {analyzeResult.map((result) => (
                                    <CommandItem
                                        key={result.url}
                                        value={result.url}
                                        disabled={result.url === url}
                                        onSelect={(currentValue) => {
                                            if (currentValue === url) return;

                                            setUrl(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        {result.url}
                                        <Check
                                            className={cn('ml-auto', url === result.url ? 'opacity-100' : 'opacity-0')}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedReport && <AxeBuilderItem axeReport={selectedReport} />}
        </section>
    );
}
