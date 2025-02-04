'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage, Form } from './ui/form';
import { Input } from './ui/input';
import Services from './Services';
import { Button } from './ui/button';

const analyzeSchema = z.object({
    url: z.string().url(),
    services: z
        .array(z.enum(['axebuilder', 'pagespeedinsight', 'whois']))
        .transform((val) => [...new Set(val)])
        .refine((val) => val.length > 0, 'Select at least one service..!'),
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

    const onSubmit: SubmitHandler<AnalyzeForm> = (data) => console.log(data);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex ">
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="sr-only">Url</FormLabel>
                            <FormControl>
                                <Input placeholder="https://wwww.google.com" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Services />
                <Button type="submit" disabled={!form.formState.isValid}>
                    Analyze
                </Button>
            </form>
        </Form>
    );
}
