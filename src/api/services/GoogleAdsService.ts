/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from '../models/ColumnData';
import type { QueryData } from '../models/QueryData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GoogleAdsService {
    /**
     * Ad Accounts
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleAdsAdAccounts(
        sessionToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/google_ads/ad_accounts',
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
    public static googleAdsFields(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/google_ads/fields',
        });
    }
    /**
     * Fetch Data
     * @param sessionToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static googleAdsFetchData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google_ads/fetch-data',
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
    public static googleAdsFetchAllData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google_ads/fetch-all-data',
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
