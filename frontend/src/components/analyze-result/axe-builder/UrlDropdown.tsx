import { useState } from 'react';
import { useAxeBuilderContext } from '.';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function UrlDropDown() {
    const { url, setUrl, selectedReport, result: analyzeResult } = useAxeBuilderContext();
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
                    className="mb-2 w-full justify-between sm:max-w-(--breakpoint-sm)"
                >
                    {selectedReport?.url || 'Enter Valid URL..!'}
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
    );
}
