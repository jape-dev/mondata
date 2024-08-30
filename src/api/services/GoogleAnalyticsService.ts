/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from '../models/ColumnData';
import type { QueryData } from '../models/QueryData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GoogleAnalyticsService {
    /**
     * Properties
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleAnalyticsProperties(
        sessionToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/google_analytics/properties',
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
    public static googleAnalyticsFields(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/google_analytics/fields',
        });
    }
    /**
     * Fetch Data
     * @param sessionToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static googleAnalyticsFetchData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google_analytics/fetch-data',
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
    public static googleAnalyticsFetchAllData(
        sessionToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google_analytics/fetch-all-data',
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
