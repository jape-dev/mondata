/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HTTPAuthorizationCredentials } from '../models/HTTPAuthorizationCredentials';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class LinkedinService {
    /**
     * Login
     * @param connectionId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static linkedinLogin(
        connectionId: string,
        requestBody: HTTPAuthorizationCredentials,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/linkedin/login',
            query: {
                'connection_id': connectionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Accounts
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static linkedinAccounts(
        sessionToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/linkedin/accounts',
            query: {
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pages
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static linkedinPages(
        sessionToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/linkedin/pages',
            query: {
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fields
     * @returns any Successful Response
     * @throws ApiError
     */
    public static linkedinFields(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/linkedin/fields',
        });
    }
}
