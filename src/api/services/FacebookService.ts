/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from '../models/ColumnData';
import type { HTTPAuthorizationCredentials } from '../models/HTTPAuthorizationCredentials';
import type { QueryData } from '../models/QueryData';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class FacebookService {
    /**
     * Login
     * @param connectionId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static facebookLogin(
        connectionId: string,
        requestBody: HTTPAuthorizationCredentials,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facebook/login',
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
     * Ad Accounts
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static facebookAdAccounts(
        sessionToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facebook/ad_accounts',
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
    public static facebookFields(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facebook/fields',
        });
    }
    /**
     * Fetch Data
     * @param sessionToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static facebookFetchData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facebook/fetch-data',
            query: {
                'session_token': sessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fetch All Data
     * @param sessionToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static facebookFetchAllData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facebook/fetch-all-data',
            query: {
                'session_token': sessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
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
    public static facebookPages(
        sessionToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facebook/pages',
            query: {
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pages Fields
     * @returns any Successful Response
     * @throws ApiError
     */
    public static facebookPagesFields(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facebook/pages/fields',
        });
    }
    /**
     * Pages Fetch All Data
     * @param sessionToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static facebookPagesFetchAllData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facebook/pages/fetch-all-data',
            query: {
                'session_token': sessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pages Fetch Data
     * @param sessionToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static facebookPagesFetchData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facebook/pages/fetch-data',
            query: {
                'session_token': sessionToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
