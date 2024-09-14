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
            url: '/api/v1/google/google-sheets/login',
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
}
