'use client';

import { Checkbox } from './ui/checkbox';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from './ui/tooltip';
import { useController, useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormLabel, FormDescription } from './ui/form';
import type { AnalyzeFormData } from '@/types';
import { useEffect } from 'react';

export default function DeepScan() {
    const form = useFormContext<AnalyzeFormData>();
    const {
        field: { value: servicesValue },
    } = useController<AnalyzeFormData>({ name: 'services' });
    const {
        field: { onChange: handleDeepScanChange },
    } = useController<AnalyzeFormData>({ name: 'deepscan' });
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
                                <div className="flex justify-center items-center space-y-0 border rounded-md shadow py-1 px-2 gap-1 h-full">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Deep Scan</FormLabel>
                                    <FormDescription className="sr-only">
                                        Enable deep scan option for axe builder
                                    </FormDescription>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Enable Deep Scan for Axe Builder</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </FormItem>
            )}
        />
    );
}
