/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MondayItem } from './MondayItem';
export type QueryData = {
    metrics: Array<string>;
    monday_items?: (Array<MondayItem> | null);
    account_id?: (string | null);
    dimensions?: (Array<string> | null);
    start_date?: (string | null);
    end_date?: (string | null);
    manager_id?: (string | null);
};

