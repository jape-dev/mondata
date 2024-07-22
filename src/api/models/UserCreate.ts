/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Plan } from './Plan';
export type UserCreate = {
    email?: (string | null);
    is_active?: boolean;
    is_superuser?: boolean;
    full_name?: (string | null);
    plan?: (Plan | null);
    monday_user_id: number;
    monday_account_id: number;
    monday_token?: (string | null);
    facebook_token?: (string | null);
    google_token?: (string | null);
    password: string;
};

