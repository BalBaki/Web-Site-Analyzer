import { useState } from 'react';
import { useAxeBuilderContext } from '.';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Status } from '@/enums';
import { cn } from '@/lib/utils';

export default function UrlDropDown() {
    const { url, setUrl, selectedReport, result: analyzeResult, device } = useAxeBuilderContext();
    const [open, setOpen] = useState(false);

    if (analyzeResult.status === Status.Err) return <div>Something went wrong...!</div>;

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
                    className="justify-between overflow-hidden pl-2"
                    aria-label={`Select analyzed URL, currently selected: ${selectedReport?.url || 'none'}`}
                >
                    <span className="truncate">{selectedReport?.url || 'Enter Valid URL..!'}</span>
                    <ChevronsUpDown className="opacity-50" />
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
                            {analyzeResult.data[device].map((result) => (
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
                                        className={cn(
                                            'text-selected-tab ml-auto',
                                            url === result.url ? 'opacity-100' : 'opacity-0',
                                        )}
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
