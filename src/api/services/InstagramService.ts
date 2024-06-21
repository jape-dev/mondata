/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from '../models/ColumnData';
import type { QueryData } from '../models/QueryData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class InstagramService {
    /**
     * Pages
     * @param accessToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static instagramPages(
        accessToken: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/instagram/pages',
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
    public static instagramFields(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/instagram/fields',
        });
    }
    /**
     * Pages Fetch Data
     * @param accessToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static instagramPagesFetchData(
        accessToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/instagram/pages/fetch-data',
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
    /**
     * Pages Fetch All Data
     * @param accessToken
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static instagramPagesFetchAllData(
        accessToken: string,
        requestBody: QueryData,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/instagram/pages/fetch-all-data',
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
