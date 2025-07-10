import * as motion from 'motion/react-client';
import Image from 'next/image';

export default function Info() {
    return (
        <section
            aria-describedby="info"
            className="overflow-hidden"
        >
            <h2
                id="info"
                className="sr-only"
            >
                Info about website
            </h2>
            <div className="mt-10 flex gap-2 max-md:flex-col max-md:items-center md:gap-8">
                <div className="space-y-4 max-md:order-2 max-md:mt-4 md:space-y-8">
                    <motion.div
                        initial={{ y: '50px', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="text-3xl font-bold uppercase"
                    >
                        Make your web pages faster across all devices
                    </motion.div>
                    <motion.div
                        initial={{ y: '50px', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                    >
                        Deliver a smoother, faster experience for your visitors and climb higher in search engine
                        rankings.
                    </motion.div>
                    <motion.div
                        initial={{ y: '50px', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.6 }}
                    >
                        Analyze your website’s accessibility, performance, and SEO to maximize user experience. Identify
                        issues automatically and get actionable insights to improve your pages.
                    </motion.div>
                </div>
                <motion.div
                    initial={{ x: '150px', opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="shrink-0"
                >
                    <Image
                        src={'/assets/home-hero-dark.webp'}
                        alt="Dark mode home page hero picture"
                        width={400}
                        height={100}
                        className="-mt-16 hidden h-fit md:max-lg:w-90 dark:block"
                    />
                    <Image
                        src={'/assets/home-hero.webp'}
                        alt="Home page hero picture"
                        width={400}
                        height={100}
                        className="-mt-16 aspect-auto h-fit md:max-lg:w-90 dark:hidden"
                    />
                </motion.div>
            </div>
        </section>
    );
}
