/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Environment } from './Environment';
import type { Plan } from './Plan';
export type Contact = {
    email: string;
    first_name?: (string | null);
    environment?: Environment;
    authenticated?: (boolean | null);
    first_import?: (boolean | null);
    account?: (string | null);
    plan?: (Plan | null);
    first_connector?: (string | null);
};

