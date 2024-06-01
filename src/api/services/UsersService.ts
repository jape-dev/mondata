/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Message } from '../models/Message';
import type { UpdatePassword } from '../models/UpdatePassword';
import type { User } from '../models/User';
import type { UserCreate } from '../models/UserCreate';
import type { UserPublic } from '../models/UserPublic';
import type { UserRegister } from '../models/UserRegister';
import type { UsersPublic } from '../models/UsersPublic';
import type { UserUpdate } from '../models/UserUpdate';
import type { UserUpdateMe } from '../models/UserUpdateMe';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Read Users
     * Retrieve users.
     * @param skip
     * @param limit
     * @returns UsersPublic Successful Response
     * @throws ApiError
     */
    public static usersReadUsers(
        skip?: number,
        limit: number = 100,
    ): CancelablePromise<UsersPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/',
            query: {
                'skip': skip,
                'limit': limit,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create User
     * Create new user.
     * @param requestBody
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersCreateUser(
        requestBody: UserCreate,
    ): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User Me
     * Get current user.
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersReadUserMe(): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/me',
        });
    }
    /**
     * Delete User Me
     * Delete own user.
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static usersDeleteUserMe(): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/me',
        });
    }
    /**
     * Update User Me
     * Update own user.
     * @param requestBody
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersUpdateUserMe(
        requestBody: UserUpdateMe,
    ): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/me',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Password Me
     * Update own password.
     * @param requestBody
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static usersUpdatePasswordMe(
        requestBody: UpdatePassword,
    ): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/me/password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Register User
     * Create new user without the need to be logged in.
     * @param requestBody
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersRegisterUser(
        requestBody: UserRegister,
    ): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/signup',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User By Id
     * Get a specific user by id.
     * @param userId
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersReadUserById(
        userId: number,
    ): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User
     * Update a user.
     * @param userId
     * @param requestBody
     * @returns UserPublic Successful Response
     * @throws ApiError
     */
    public static usersUpdateUser(
        userId: number,
        requestBody: UserUpdate,
    ): CancelablePromise<UserPublic> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete User
     * Delete a user.
     * @param userId
     * @returns Message Successful Response
     * @throws ApiError
     */
    public static usersDeleteUser(
        userId: number,
    ): CancelablePromise<Message> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/{user_id}',
            path: {
                'user_id': userId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Read User By Monday Session
     * Get a specific user by monday id.
     *
     * TODO: set-up using dependencies.
     * @param sessionToken
     * @returns User Successful Response
     * @throws ApiError
     */
    public static usersReadUserByMondaySession(
        sessionToken: string,
    ): CancelablePromise<User> {
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
}
