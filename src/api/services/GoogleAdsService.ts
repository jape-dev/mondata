/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_google_ads_fetch_all_data } from '../models/Body_google_ads_fetch_all_data';
import type { Body_google_ads_fetch_data } from '../models/Body_google_ads_fetch_data';
import type { ColumnData } from '../models/ColumnData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GoogleAdsService {
    /**
     * Ad Accounts
     * @param refreshToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleAdsAdAccounts(
        refreshToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/google_ads/ad_accounts',
            query: {
                'refresh_token': refreshToken,
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
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static googleAdsFetchData(
        requestBody: Body_google_ads_fetch_data,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google_ads/fetch-data',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Fetch All Data
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static googleAdsFetchAllData(
        requestBody: Body_google_ads_fetch_all_data,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google_ads/fetch-all-data',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
