'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import DeepScan from './DeepScan';
import Services from './Services';
import { Button } from './ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { stringifyObjectValues } from '@/lib/utils';
import { analyzeFormSchema } from '@/schemas';
import type { AnalyzeFormData } from '@/types';

export default function AnalyzeForm() {
    const pathname = usePathname();
    const router = useRouter();
    const form = useForm<AnalyzeFormData>({
        mode: 'all',
        resolver: zodResolver(analyzeFormSchema),
        defaultValues: {
            url: '',
            services: ['axebuilder', 'pagespeedinsight', 'whois'],
            deepscan: false,
        },
    });

    const onSubmit: SubmitHandler<AnalyzeFormData> = async (data) => {
        router.push(`${pathname}analysis/?${new URLSearchParams(stringifyObjectValues(data))}`);
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-2 flex justify-center gap-3 max-sm:flex-col"
            >
                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem className="w-full space-y-0 sm:max-w-96">
                            <FormLabel className="sr-only">Url</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://wwww.google.com"
                                    className="w-full"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Services />
                <DeepScan />
                <Button
                    type="submit"
                    disabled={!form.formState.isValid}
                    className="h-full"
                >
                    Analyze
                </Button>
            </form>
        </Form>
    );
}
