'use client';

import { useAxeBuilderContext } from '..';
import { Status } from '@/enums';
import { cn } from '@/lib/utils';

export default function TabNavigationOrder() {
    const { selectedReport } = useAxeBuilderContext();

    if (!selectedReport || selectedReport.status === Status.Err) return null;

    return (
        <section
            aria-labelledby="tab-navigation-order"
            className="overflow-y-auto pb-2"
        >
            <h3
                id="tab-navigation-order"
                className="m-3 text-3xl font-semibold"
            >
                Tab Navigation Order
            </h3>
            <div
                className="space-y-2 px-3 py-1"
                role="list"
                aria-label="Tabbeable Element List"
            >
                {selectedReport.data.tabNavigationOrder.length > 0 ? (
                    selectedReport.data.tabNavigationOrder
                        .toSorted((a, b) => b.tabIndex - a.tabIndex)
                        .map((elem, index) => {
                            return (
                                <div
                                    key={index}
                                    className={cn('flex items-center gap-x-2', {
                                        'text-gray-500': elem.disabled,
                                    })}
                                >
                                    <span className="size-9 h-fit shrink-0 rounded-sm bg-blue-500 p-1 text-center text-white">
                                        {index + 1}
                                    </span>
                                    <span className="shrink-0 capitalize">
                                        {(elem.disabled ? 'Disabled(Not Tabbeable) ' : '') + elem.elementType} :
                                    </span>
                                    {`${elem.text || elem.name || elem.ariaLabel || elem.title}`}
                                </div>
                            );
                        })
                ) : (
                    <p className="p-4 text-center text-gray-500">No tabbelable is found in page</p>
                )}
            </div>
        </section>
    );
}
