'use client';

import { useFormContext } from 'react-hook-form';
import { FaCheck } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { AnalyzeFormData } from '@/types';

interface Service {
    name: string;
    value: AnalyzeFormData['services'][number];
}

const services: Service[] = [
    {
        name: 'Axe Builder',
        value: 'axebuilder',
    },
    {
        name: 'Page Speed Insight',
        value: 'pagespeedinsight',
    },
    {
        name: 'Who Is',
        value: 'whois',
    },
];

export default function Services() {
    const form = useFormContext<AnalyzeFormData>();

    return (
        <FormField
            control={form.control}
            name="services"
            render={({ field }) => (
                <FormItem className="space-y-0">
                    <FormLabel className="sr-only">Services</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        'justify-between w-full sm:w-52',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                    aria-label="Select your services"
                                >
                                    Select Service
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                            className="p-0 popover-content-width-same-as-its-trigger!"
                            side="bottom"
                        >
                            <Command>
                                {/* <CommandInput placeholder="Search language..." className="h-9" />
                                <CommandEmpty>No language found.</CommandEmpty> */}
                                <CommandGroup>
                                    <CommandList>
                                        {services.map(({ value, name }) => (
                                            <CommandItem
                                                key={value}
                                                value={value}
                                                onSelect={() => {
                                                    field.onChange(
                                                        field.value.includes(value)
                                                            ? field.value.filter((data) => data !== value)
                                                            : [...field.value, value]
                                                    );
                                                }}
                                            >
                                                <div className="flex w-full items-center text-sm font-normal">
                                                    {name}
                                                    {field.value?.some((data) => data === value) && (
                                                        <FaCheck className={'ml-auto h-4 w-4'} />
                                                    )}
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandList>
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormDescription />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
