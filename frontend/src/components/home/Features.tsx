'use client';

import * as motion from 'motion/react-client';
import { FaUniversalAccess } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface Feature {
    id: string;
    title: string;
    explanation: string;
    icon: React.ReactNode;
    config?: {
        wrapper?: string;
        icon?: string;
        title?: string;
        explanation?: string;
        button?: string;
    };
}

const features: Feature[] = [
    {
        id: 'accessibility',
        title: 'Accessibility Testing',
        explanation:
            "Utilizes Playwright's Axe Builder to automatically detect accessibility issues across your web pages. This feature identifies elements that may not comply with WCAG standards and suggests actionable solutions to enhance usability for users with disabilities, ensuring your website is inclusive and accessible to all.",
        icon: (
            <FaUniversalAccess className="size-10 text-blue-400 dark:rounded-full dark:bg-radial dark:from-white dark:from-60% dark:to-blue-700 dark:to-60% dark:fill-blue-700" />
        ),
        config: {
            wrapper: 'border-blue-400 dark:border-blue-700',
            icon: 'border-blue-400 dark:border-blue-700',
            button: 'bg-blue-400 dark:bg-blue-700 hover:bg-blue-400',
        },
    },
    {
        id: 'heading-structure',
        title: 'Heading Structure Validation',
        explanation:
            'Scans the semantic heading structure of your pages to ensure proper use of <h1> to <h6> tags in a logical, nested order. Helps screen reader users understand content hierarchy and provides suggestions for correcting skipped or misused headings.',
        icon: '🧱',
        config: {
            wrapper: 'border-orange-400 dark:border-orange-700',
            icon: 'border-orange-400 dark:border-orange-700',
            button: 'bg-orange-400 dark:bg-orange-700 hover:bg-orange-400',
        },
    },
    {
        id: 'tab-navigation-order',
        title: 'Tab Navigation Order Check',
        explanation:
            'Examines the keyboard tabbing sequence of interactive elements like buttons and inputs to ensure a natural, accessible navigation flow. Identifies unreachable elements, improper order, and missing focus indicators to support keyboard users effectively.',
        icon: '⌨️',
        config: {
            wrapper: 'border-purple-400 dark:border-purple-700',
            icon: '-mt-2.5 border-purple-400 py-3.5 dark:border-purple-700',
            button: 'bg-purple-400 dark:bg-purple-700 hover:bg-purple-400',
        },
    },
    {
        id: 'performance',
        title: 'Performance Analysis',
        explanation:
            'Integrates with the Google PageSpeed Insights API to evaluate the performance of your website on both mobile and desktop devices. It provides metrics such as FCP, LCP, and CLS, along with prioritized recommendations to speed up load times and improve responsiveness.',
        icon: '⚡',
        config: {
            wrapper: 'border-yellow-600 dark:border-orange-400',
            icon: 'border-yellow-600 dark:border-orange-400',
            button: 'bg-yellow-600 dark:bg-orange-400 hover:bg-yellow-600',
        },
    },
    {
        id: 'seo',
        title: 'SEO & Best Practices',
        explanation:
            'Analyzes your website to ensure it adheres to the latest SEO standards and web development best practices. It checks for meta tags, alt attributes, heading hierarchy, mobile optimization, and deprecated code usage to improve visibility and technical quality.',
        icon: '📈',
        config: {
            wrapper: 'border-indigo-400 dark:border-indigo-700',
            icon: 'border-indigo-400 dark:border-indigo-700',
            button: 'bg-indigo-400 dark:bg-indigo-700 hover:bg-indigo-400',
        },
    },
    {
        id: 'domain-info',
        title: 'Domain Information',
        explanation:
            'Uses Whois API integration to retrieve real-time domain data including registration, expiration dates, and ownership information. Ideal for verifying domain authenticity, competitive analysis, or conducting technical audits on domains you own.',
        icon: '🌐',
        config: {
            wrapper: 'border-cyan-400 dark:border-cyan-700',
            icon: 'border-cyan-400 dark:border-cyan-700',
            button: 'bg-cyan-400 dark:bg-cyan-700 hover:bg-cyan-400',
        },
    },
    {
        id: 'ai-powered-support',
        title: 'AI-Powered Support',
        explanation:
            'Provides intelligent, context-aware assistance to help you troubleshoot technical issues and apply optimization strategies. The AI assistant offers step-by-step guidance and automated suggestions to improve performance, SEO, and accessibility with minimal effort.',
        icon: '🤖',
        config: {
            wrapper: 'border-fuchsia-400 dark:border-fuchsia-700',
            icon: 'border-fuchsia-400 dark:border-fuchsia-700',
            button: 'bg-fuchsia-400 dark:bg-fuchsia-700 hover:bg-fuchsia-400',
        },
    },
];

export default function Features() {
    const handleStartAnalyzeClick = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    return (
        <section
            aria-describedby="features"
            className="mt-12"
        >
            <h2
                id="features"
                className="sr-only"
            >
                Features
            </h2>
            <div
                className="grid gap-6 min-md:grid-cols-2 min-xl:grid-cols-3 min-2xl:grid-cols-4"
                role="list"
            >
                {features.map(({ id, title, explanation, icon, config }, index) => {
                    return (
                        <motion.article
                            id={id}
                            key={title}
                            className={cn(
                                'flex min-h-48 flex-col gap-y-4 overflow-hidden rounded-2xl border-2 shadow-xl hover:-translate-y-2',
                                config?.wrapper,
                            )}
                            role="listitem"
                            initial={{ y: '50px', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: (index + 1) * 0.1 }}
                        >
                            <span
                                aria-hidden="true"
                                className={cn(
                                    'ml-auto rounded-bl-2xl border-b-2 border-l-2 p-2 text-4xl',
                                    config?.icon,
                                )}
                            >
                                {icon}
                            </span>
                            <div className="flex h-full flex-col gap-y-4 px-6 pb-6">
                                <h3 className={cn('text-xl font-semibold', config?.title)}>{title}</h3>
                                <p className={cn(config?.explanation)}>{explanation}</p>
                                <Button
                                    className={cn('hover mt-auto text-white hover:scale-105', config?.button)}
                                    onClick={handleStartAnalyzeClick}
                                >
                                    Start Analyze
                                </Button>
                            </div>
                        </motion.article>
                    );
                })}
            </div>
        </section>
    );
}
