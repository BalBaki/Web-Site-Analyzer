import Image from 'next/image';
import Link from 'next/link';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
    return (
        <header
            role="navigation"
            className="bg-background sticky top-0 z-50 flex border-b-2 p-2"
        >
            <Link
                href="/"
                className="mr-auto flex items-center gap-2"
            >
                <Image
                    src="/assets/header-icon.png"
                    alt="Header icon"
                    width={35}
                    height={35}
                    priority
                    className="dark:hidden"
                />
                <Image
                    src="/assets/header-icon-dark.png"
                    alt="Dark mode header icon"
                    width={35}
                    height={35}
                    priority
                    className="hidden dark:block"
                />
                <h1
                    id="web-site-analyzer"
                    className="text-xl"
                >
                    Web Site Analyzer
                </h1>
            </Link>
            <ThemeSwitcher />
        </header>
    );
}
