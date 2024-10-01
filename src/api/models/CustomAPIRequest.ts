/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from './ColumnData';
import type { PairValue } from './PairValue';
export type CustomAPIRequest = {
    method?: string;
    url: string;
    auth?: (string | null);
    headers?: (Array<PairValue> | null);
    params?: (Array<PairValue> | null);
    body?: (string | null);
    columns?: (Array<ColumnData> | null);
};

