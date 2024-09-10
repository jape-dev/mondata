/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from './ColumnData';
import type { SchedulePeriod } from './SchedulePeriod';
export type ScheduleInput = {
    user_id: number;
    board_id: number;
    workspace_id: number;
    account_id: number;
    group_id?: (string | null);
    board_name?: (string | null);
    group_name?: (string | null);
    connector?: (string | null);
    period?: (SchedulePeriod | null);
    step?: (number | null);
    days?: (Array<string> | null);
    start_datetime?: (string | null);
    tz_offset?: (number | null);
    data?: (Array<ColumnData> | null);
};

