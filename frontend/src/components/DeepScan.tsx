'use client';

import { useEffect } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Checkbox } from './ui/checkbox';
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from './ui/form';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
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
                                <div className="flex h-fit items-center justify-center gap-1 space-y-0 rounded-md border px-4 py-2 shadow-sm">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel>Deep Scan</FormLabel>
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
