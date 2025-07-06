/* eslint-disable @typescript-eslint/no-explicit-any */

import * as z from 'zod';
import { Status } from '@/enums';
import type { ReactNode } from 'react';

export type Result<Ok, Err> = { status: Status.Ok; data: Ok } | { status: Status.Err; err: Err };
export type AsyncResult<Ok, Err> = Promise<Result<Ok, Err>>;
export type BaseError = string;

export type DataType = 'null' | 'undefined' | 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object' | 'unknown';

export type DataTypeWithSchema = {
    type: DataType;
    schema: z.ZodSchema<any>;
};

type DataTypeToTSType = {
    null: null;
    undefined: undefined;
    string: string;
    number: number;
    boolean: boolean;
    date: Date;
    array: any[];
    object: Record<string, any>;
    unknown: unknown;
};

export type DetectedDataResult<T extends DataType> = {
    type: T;
    data: DataTypeToTSType[T];
};

export type AnyDetectedDataResult = {
    [T in DataType]: DetectedDataResult<T>;
}[DataType];

export type Device = 'desktop' | 'tablet' | 'mobile';

export type RenderConfig = {
    name: string;
    key: string;
    render: (value: any, index?: number) => ReactNode;
    container?: (children: ReactNode) => ReactNode;
    childConfigs?: RenderConfig[];
};

export type SimpleRenderConfig = Omit<RenderConfig, 'render' | 'childConfigs'> & {
    isLink?: boolean;
    truncateMiddle?: boolean;
    childConfigs?: SimpleRenderConfig[];
};
