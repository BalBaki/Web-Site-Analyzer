'use client';

import { createContext, use, useMemo, useState } from 'react';
import DeviceTabs from './DeviceTabs';
import ExtraInfo from './extra-info';
import ReportChart from './ReportChart';
import ReportList from './ReportList';
import UrlDropDown from './UrlDropdown';
import { Status } from '@/enums';
import type { AxePageScanResult, AxeResult, Device } from '@/types';

type AxeBuilderProps = {
    analyzeResult: AxeResult;
    defaultUrl: string;
};
type AxeBuilderContextType = {
    url: string;
    setUrl: (url: string) => void;
    selectedReport?: AxePageScanResult;
    result: AxeResult;
    device: Device;
    setDevice: (device: Device) => void;
};

const AxeBuilderContext = createContext<AxeBuilderContextType | null>(null);

export const useAxeBuilderContext = () => {
    const axeBuilderContext = use(AxeBuilderContext);

    if (!axeBuilderContext) throw new Error('Wrap compoment with AxeBuilder');

    return axeBuilderContext;
};

export default function AxeBuilder({ analyzeResult, defaultUrl }: AxeBuilderProps) {
    const [selectedUrl, setSelectedUrl] = useState(defaultUrl);
    const [device, setDevice] = useState<Device>('desktop');
    const isErrorExists = analyzeResult.status === Status.Err;
    const selectedReport = useMemo(
        () =>
            isErrorExists
                ? undefined
                : analyzeResult.data[device].find(
                      (result) => result.url === selectedUrl || result.url === selectedUrl + '/',
                  ),
        [selectedUrl, analyzeResult, isErrorExists, device],
    );

    const setUrl = (url: string) => {
        if (selectedUrl === url) return;

        setSelectedUrl(url);
    };
    const changeDevice = (newDevice: Device) => {
        if (device === newDevice) return;

        setDevice(newDevice);
    };

    if (isErrorExists) return <div>Error at AxeBuilder Service</div>;

    return (
        <AxeBuilderContext
            value={{ url: selectedUrl, setUrl, selectedReport, result: analyzeResult, device, setDevice: changeDevice }}
        >
            <h2 className="sr-only">Axe Builder Analyze Result</h2>
            <DeviceTabs />
            <UrlDropDown />
            {selectedReport && selectedReport.status === Status.Ok ? (
                <>
                    <div className="mb-2 grid grid-cols-1 gap-y-2 rounded-md border-2 shadow-sm md:grid-cols-2 md:divide-x-2">
                        <ReportChart />
                        <ExtraInfo />
                    </div>
                    <ReportList />
                </>
            ) : (
                <div>Error at Analyzing at this page..</div>
            )}
        </AxeBuilderContext>
    );
}
