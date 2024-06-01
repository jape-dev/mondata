/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MondayItem } from './MondayItem';
export type QueryData = {
    monday_items: Array<MondayItem>;
    account_id: string;
    metrics: Array<string>;
    start_date?: (string | null);
    end_date?: (string | null);
};

