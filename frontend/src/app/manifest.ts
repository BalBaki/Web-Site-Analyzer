import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Web Site Analyzer | SEO & Performance Reports with AI Help',
        short_name: 'Web Site Analyzer',
        description:
            'Web Site Analyzer audits SEO, performance, accessibility, and best practices of websites on both desktop and mobile using Playwright, AxeBuilder, and Google PageSpeed Insights.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
        ],
        lang: 'en',
        categories: ['utilities', 'productivity', 'developer-tools', 'education', 'business'],
    };
}
