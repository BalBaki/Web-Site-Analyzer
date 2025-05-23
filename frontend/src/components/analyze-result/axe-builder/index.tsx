'use client';

import { createContext, use, useMemo, useState } from 'react';
import HeadingStructure from './HeadingStructure';
import ReportChart from './ReportChart';
import ReportList from './ReportList';
import UrlDropDown from './UrlDropdown';
import type { AxeBuilderData, AxeBuilderResponse } from '@/types';

type AxeBuilderProps = {
    analyzeResult: AxeBuilderResponse;
    defaultUrl: string;
};
type AxeBuilderContextType = {
    url: string;
    setUrl: (url: string) => void;
    selectedReport?: AxeBuilderData[number];
    result: AxeBuilderData;
};

const AxeBuilderContext = createContext<AxeBuilderContextType | null>(null);

export const useAxeBuilderContext = () => {
    const axeBuilderContext = use(AxeBuilderContext);

    if (!axeBuilderContext) throw new Error('Wrap compoment with AxeBuilder');

    return axeBuilderContext;
};

export default function AxeBuilder({ analyzeResult, defaultUrl }: AxeBuilderProps) {
    const [selectedUrl, setSelectedUrl] = useState(defaultUrl);
    const isErrorExists = 'error' in analyzeResult;
    const selectedReport = useMemo(
        () =>
            isErrorExists
                ? undefined
                : analyzeResult.find((result) => result.url === selectedUrl || result.url === selectedUrl + '/'),
        [selectedUrl, analyzeResult, isErrorExists],
    );

    const setUrl = (url: string) => {
        if (selectedUrl === url) return;

        setSelectedUrl(url);
    };

    if (isErrorExists) return <div>Error at AxeBuilder Service</div>;

    return (
        <AxeBuilderContext value={{ url: selectedUrl, setUrl, selectedReport, result: analyzeResult }}>
            <h2 className="sr-only">Axe Builder Analyze Result</h2>
            <UrlDropDown />
            <div className="divide mb-2 grid grid-cols-1 gap-2 divide-y-2 rounded-md border shadow-sm md:grid-cols-2 md:divide-x-2 md:divide-y-0">
                <ReportChart />
                <HeadingStructure />
            </div>
            <ReportList />
        </AxeBuilderContext>
    );
}
