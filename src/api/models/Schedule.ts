/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Schedule = {
    user_id: number;
    board_id: number;
    group_id: number;
    board_name?: (string | null);
    workspace_id: number;
    account_id: number;
    connector?: (string | null);
    cron?: (string | null);
    tz_offset?: (number | null);
    data: null;
    last_run_at?: (string | null);
    next_run_at?: (string | null);
    id?: (number | null);
    created_at?: (string | null);
};

