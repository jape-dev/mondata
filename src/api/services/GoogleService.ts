/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HTTPAuthorizationCredentials } from '../models/HTTPAuthorizationCredentials';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class GoogleService {
    /**
     * Login
     * @param connectionId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static googleLogin(
        connectionId: string,
        requestBody: HTTPAuthorizationCredentials,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google/login',
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
     * Google Sheets Login
     * @param connectionId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleGoogleSheetsLogin(
        connectionId: string,
        requestBody: HTTPAuthorizationCredentials,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google/sheets/login',
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
     * Get Sheets Sheets
     * @param sessionToken
     * @param url
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleGetSheetsSheets(
        sessionToken: string,
        url: string,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/google/sheets',
            query: {
                'session_token': sessionToken,
                'url': url,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Sheet Headers
     * @param sessionToken
     * @param url
     * @param sheetName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static googleGetSheetHeaders(
        sessionToken: string,
        url: string,
        sheetName: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/google/sheets/headers',
            query: {
                'session_token': sessionToken,
                'url': url,
                'sheet_name': sheetName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
