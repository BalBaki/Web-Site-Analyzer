'use client';

import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { AnalyzeFormData } from '@/types';

export default function DeepScan() {
    const form = useFormContext<AnalyzeFormData>();
    const {
        field: { value: servicesValue },
    } = useController<AnalyzeFormData>({
        name: 'services',
    });
    const {
        field: { onChange: handleDeepScanChange },
    } = useController<AnalyzeFormData>({
        name: 'deepscan',
    });
    const services = servicesValue as AnalyzeFormData['services'];

    useEffect(() => {
        if (!services.includes('axebuilder')) {
            handleDeepScanChange(false);
        }
    }, [handleDeepScanChange, services]);

    if (!services.includes('axebuilder')) return null;

    return (
        <FormField
            control={form.control}
            name="deepscan"
            render={({ field }) => (
                <FormItem>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="relative mb-0 flex h-9 min-w-44 items-center justify-center gap-1 space-y-0 rounded-md border px-6 shadow-sm after:ml-1 after:text-sm after:content-['Deep_Scan']">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            aria-label="Deep scan"
                                            className="dark:data-[state=checked]:bg-primary relative data-[state=checked]:bg-blue-600"
                                        >
                                            Deep Scan
                                        </Checkbox>
                                    </FormControl>
                                    <FormLabel className="absolute inset-0 z-50"></FormLabel>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Enable Deep Scan for Axe Builder</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <FormDescription className="sr-only">Enable deep scan option for axe builder</FormDescription>
                </FormItem>
            )}
        />
    );
}
