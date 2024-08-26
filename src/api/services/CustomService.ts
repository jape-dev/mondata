/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from '../models/ColumnData';
import type { CustomAPIRequest } from '../models/CustomAPIRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CustomService {
    /**
     * Fetch Data
     * @param requestBody
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static customFetchData(
        requestBody: Record<string, any>,
    ): CancelablePromise<Array<ColumnData>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/custom/fetch-data',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Api Request
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static customApiRequest(
        requestBody: CustomAPIRequest,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/custom/api-request',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Test Data
     * @returns any Successful Response
     * @throws ApiError
     */
    public static customTestData(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/custom/test_data',
        });
    }
}
