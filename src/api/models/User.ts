/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Plan } from './Plan';
export type User = {
    email?: (string | null);
    is_active?: boolean;
    is_superuser?: boolean;
    full_name?: (string | null);
    plan?: (Plan | null);
    monday_user_id: number;
    monday_account_id: number;
    monday_token?: (Blob | null);
    nonce?: (Blob | null);
    facebook_token?: (string | null);
    google_token?: (string | null);
    google_sheets_token?: (string | null);
    shopify_token?: (string | null);
    id?: (number | null);
    hashed_password: string;
};

