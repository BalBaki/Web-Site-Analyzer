'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from '@/components/ThemeProvider';

const queryClient = new QueryClient();

export default function Providers({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                {children}
            </ThemeProvider>
        </QueryClientProvider>
    );
}
