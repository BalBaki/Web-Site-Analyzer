'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import DeepScan from './DeepScan';
import Services from './Services';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
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
        <section
            aria-describedby="analyze-form"
            className="my-6 md:mt-16 md:mb-20"
        >
            <h2
                id="analyze-form"
                className="sr-only"
            >
                Analyze Form
            </h2>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="mt-2 grid grid-cols-[1fr_auto_auto_auto] justify-center gap-3 max-sm:grid-cols-1 sm:max-lg:grid-cols-2"
                    >
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem className="space-y-0 sm:max-lg:col-span-full">
                                    <FormLabel className="sr-only">Url</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter Website URL"
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
                            variant="analyze"
                            className="w-full px-16 sm:max-lg:col-span-full"
                        >
                            Analyze
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </section>
    );
}
