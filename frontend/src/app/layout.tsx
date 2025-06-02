import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Header from '@/components/Header';
import ReactScan from '@/components/ReactScan';
import { env } from '@/services/env.service';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Web Site Analyzer | SEO & Performance Reports with AI Help',
    description:
        'Web Site Analyzer audits SEO, performance, accessibility, and best practices of websites on both desktop and mobile using Playwright, AxeBuilder, and Google PageSpeed Insights.',
    keywords: [
        'website analyzer',
        'SEO audit',
        'performance check',
        'accessibility testing',
        'best practices',
        'PageSpeed Insights',
        'AxeBuilder',
        'heading structure',
        'domain info',
    ],
    authors: [{ name: 'Baki' }],
    robots: 'index, follow',
    metadataBase: new URL(env.siteURL),
    openGraph: {
        title: 'Web Site Analyzer | Complete SEO and Performance Audits',
        description:
            "Analyze any website's SEO, performance, accessibility, and best practices. Get visual reports, AI-based suggestions, domain info, and structured heading trees.",
        url: env.siteURL,
        siteName: 'Web Site Analyzer',
        images: [
            {
                url: '/preview.jpg',
                width: 1200,
                height: 630,
                alt: 'Website analysis preview by Web Site Analyzer',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Web Site Analyzer | Full Website SEO & Performance Reports',
        description:
            'Use Web Site Analyzer to uncover SEO issues, improve web performance, and get AI-powered fixes with detailed domain and heading tree insights.',
        images: [
            {
                url: '/preview.jpg',
                width: 1200,
                height: 630,
                alt: 'Website analysis preview by Web Site Analyzer',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
        >
            <body
                className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col px-2! antialiased`}
            >
                {env.isDevelopment && <ReactScan />}
                <Providers>
                    <Header />
                    <main
                        role="main"
                        className="mt-1 flex-1"
                        aria-describedby="web-site-analyzer"
                    >
                        <h1
                            id="web-site-analyzer"
                            className="sr-only"
                        >
                            Web Site Analyzer
                        </h1>
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
