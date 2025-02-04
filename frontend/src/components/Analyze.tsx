'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from './ui/form';
import { Input } from './ui/input';
import Services from './Services';
import { Button } from './ui/button';

const analyzeSchema = z.object({
    url: z.string().url('Enter Valid Url'),
    services: z
        .array(z.enum(['axebuilder', 'pagespeedinsight', 'whois']))
        .transform((val) => [...new Set(val)])
        .refine((val) => val.length > 0, 'Select at least one service!'),
});
export type AnalyzeForm = z.infer<typeof analyzeSchema>;

export default function Analyze() {
    const form = useForm<AnalyzeForm>({
        mode: 'all',
        resolver: zodResolver(analyzeSchema),
        defaultValues: {
            url: '',
            services: ['axebuilder', 'pagespeedinsight', 'whois'],
        },
    });

    const onSubmit: SubmitHandler<AnalyzeForm> = async (data) => {
        try {
            const response = await fetch(
                'http://localhost:3000/analyze?' +
                    new URLSearchParams({ url: data.url, data: JSON.stringify(data.services) })
            );

            if (!response.ok) console.log('Error. Status: ', response.status);

            const result = await response.json();

            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex justify-center gap-3 max-sm:flex-col mt-2">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem className="space-y-0 sm:max-w-96 w-full">
                            <FormLabel className="sr-only">Url</FormLabel>
                            <FormControl>
                                <Input placeholder="https://wwww.google.com" className="w-full" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Services />
                <Button type="submit" disabled={!form.formState.isValid} className="h-full">
                    Analyze
                </Button>
            </form>
        </Form>
    );
}
