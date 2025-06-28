import * as motion from 'motion/react-client';

interface Feature {
    title: string;
    explanation: string;
}

const features: Feature[] = [
    {
        title: '♿ Accessibility Testing',
        explanation:
            "Utilizes Playwright's Axe Builder to automatically detect accessibility issues across your web pages. This feature identifies elements that may not comply with WCAG standards and suggests actionable solutions to enhance usability for users with disabilities, ensuring your website is inclusive and accessible to all.",
    },
    {
        title: '🧱 Heading Structure Validation',
        explanation:
            'Scans the semantic heading structure of your pages to ensure proper use of <h1> to <h6> tags in a logical, nested order. Helps screen reader users understand content hierarchy and provides suggestions for correcting skipped or misused headings.',
    },
    {
        title: '⌨️ Tab Navigation Order Check',
        explanation:
            'Examines the keyboard tabbing sequence of interactive elements like buttons and inputs to ensure a natural, accessible navigation flow. Identifies unreachable elements, improper order, and missing focus indicators to support keyboard users effectively.',
    },
    {
        title: '⚡ Performance Analysis',
        explanation:
            'Integrates with the Google PageSpeed Insights API to evaluate the performance of your website on both mobile and desktop devices. It provides metrics such as FCP, LCP, and CLS, along with prioritized recommendations to speed up load times and improve responsiveness.',
    },
    {
        title: '📈 SEO & Best Practices',
        explanation:
            'Analyzes your website to ensure it adheres to the latest SEO standards and web development best practices. It checks for meta tags, alt attributes, heading hierarchy, mobile optimization, and deprecated code usage to improve visibility and technical quality.',
    },
    {
        title: '🌐 Domain Information',
        explanation:
            'Uses Whois API integration to retrieve real-time domain data including registration, expiration dates, and ownership information. Ideal for verifying domain authenticity, competitive analysis, or conducting technical audits on domains you own.',
    },
    {
        title: '🤖 AI-Powered Support',
        explanation:
            'Provides intelligent, context-aware assistance to help you troubleshoot technical issues and apply optimization strategies. The AI assistant offers step-by-step guidance and automated suggestions to improve performance, SEO, and accessibility with minimal effort.',
    },
];

export default function Features() {
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
                className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-3"
                role="list"
            >
                {features.map((feature, index) => {
                    return (
                        <motion.div
                            key={feature.title}
                            className="bg-feature-card min-h-48 rounded-3xl border-2 p-4"
                            role="listitem"
                            initial={{ y: '50px', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.5, ease: 'easeOut', delay: (index + 1) * 0.1 }}
                        >
                            <article className="space-y-2">
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="text-justify">{feature.explanation}</p>
                            </article>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
