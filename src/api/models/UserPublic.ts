/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Plan } from './Plan';
export type UserPublic = {
    email?: (string | null);
    is_active?: boolean;
    is_superuser?: boolean;
    full_name?: (string | null);
    plan?: (Plan | null);
    monday_user_id?: (string | null);
    monday_workspace_id?: (string | null);
    monday_token?: (string | null);
    facebook_token?: (string | null);
    google_token?: (string | null);
    id: number;
};

