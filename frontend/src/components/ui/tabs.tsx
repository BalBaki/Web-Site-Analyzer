'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn('flex flex-col gap-2', className)}
            {...props}
        />
    );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                'text-muted-foreground dark:border-border inline-flex h-9 w-fit items-center justify-center rounded-lg border-b-2 bg-transparent bg-none p-[3px]',
                className,
            )}
            {...props}
        />
    );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:text-muted-foreground data-[state=active]:text-selected-tab data-[state=active]:after:bg-selected-tab data-[state=inactive]:hover:text-selected-tab/90 dark:data-[state=inactive]:hover:text-foreground/90 relative inline-flex h-[calc(100%-1px)] flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border-0 border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-black/60 capitalize transition-[color,box-shadow] after:absolute after:inset-x-0 after:-bottom-1.25 after:z-[3] after:h-[2px] after:origin-left after:scale-x-0 after:transition-all after:duration-500 after:content-[''] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-b-2 data-[state=active]:border-none data-[state=active]:shadow-none data-[state=active]:after:scale-x-100 dark:data-[state=active]:after:bg-white [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn('flex-1 outline-none', className)}
            {...props}
        />
    );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
