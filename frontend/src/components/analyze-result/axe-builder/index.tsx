'use client';

import { createContext, use, useMemo, useState } from 'react';
import DeviceDropdown from './DeviceDropdown';
import ReportSummary from './report-summary';
import UrlDropDown from './UrlDropdown';
import ViolationChart from './ViolationChart';
import ViolationList from './ViolationList';
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

    const key = selectedUrl + device;

    return (
        <AxeBuilderContext
            value={{ url: selectedUrl, setUrl, selectedReport, result: analyzeResult, device, setDevice: changeDevice }}
        >
            <div className="mt-3 rounded-lg border-2 py-2 shadow-sm">
                <h2 className="sr-only">Axe Builder Analyze Result</h2>
                <section aria-describedby="analyze-result-filters">
                    <h3
                        id="analyze-result-filters"
                        className="sr-only"
                    >
                        Analyze result filters
                    </h3>
                    <div className="mb-2 grid items-center gap-2 px-2 sm:max-w-3xl sm:grid-cols-[1fr_auto]">
                        <UrlDropDown />
                        <DeviceDropdown />
                    </div>
                </section>
                {selectedReport && selectedReport.status === Status.Ok ? (
                    <>
                        <div className="grid grid-cols-1 gap-y-2 border-y-2 max-md:divide-y-2 md:grid-cols-2 md:divide-x-2">
                            <ViolationChart />
                            <ReportSummary key={key} />
                        </div>
                        <ViolationList key={key} />
                    </>
                ) : (
                    <div>Error at Analyzing at this page..</div>
                )}
            </div>
        </AxeBuilderContext>
    );
}
