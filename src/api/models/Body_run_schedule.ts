/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from './ColumnData';
import type { CustomAPIRequest } from './CustomAPIRequest';
import type { QueryData } from './QueryData';
import type { ScheduleInput } from './ScheduleInput';
export type Body_run_schedule = {
    schedule_input: ScheduleInput;
    query: (QueryData | CustomAPIRequest);
    data?: (Array<ColumnData> | null);
};

