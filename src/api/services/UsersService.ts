/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Contact } from '../models/Contact';
import type { UserPublic } from '../models/UserPublic';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Read User By Monday Session
     * Get a specific user by monday id.
     * @param sessionToken
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersReadUserByMondaySession(
        sessionToken: string,
    ): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/monday_user',
            query: {
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Connected
     * @param userId
     * @param connector
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static usersConnected(
        userId: number,
        connector: string,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/connected',
            query: {
                'user_id': userId,
                'connector': connector,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Contact
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static usersUpdateContact(
        requestBody: Contact,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/email/update_contact',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * First Connector
     * @param mondayUserId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static usersFirstConnector(
        mondayUserId: number,
        requestBody: Contact,
    ): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/email/first_connector',
            query: {
                'monday_user_id': mondayUserId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
