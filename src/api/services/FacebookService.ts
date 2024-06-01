/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_facebook_fetch_data } from '../models/Body_facebook_fetch_data';
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
     * @param accessToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static facebookAdAccounts(
        accessToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facebook/ad_accounts',
            query: {
                'access_token': accessToken,
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
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static facebookFetchData(
        requestBody: Body_facebook_fetch_data,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facebook/fetch-data',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Pages
     * @param accessToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static facebookPages(
        accessToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/facebook/pages',
            query: {
                'access_token': accessToken,
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
     * Pages Fetch Data
     * @param accessToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static facebookPagesFetchData(
        accessToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/facebook/pages/fetch-data',
            query: {
                'access_token': accessToken,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
