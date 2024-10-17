/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HTTPAuthorizationCredentials } from '../models/HTTPAuthorizationCredentials';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ShopifyService {
    /**
     * Install
     * @returns any Successful Response
     * @throws ApiError
     */
    public static shopifyInstall(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/shopify/install',
        });
    }
    /**
     * Login
     * @param connectionId
     * @param requestBody
     * @returns User Successful Response
     * @throws ApiError
     */
    public static shopifyLogin(
        connectionId: string,
        requestBody: HTTPAuthorizationCredentials,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/shopify/login',
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
     * Login
     * @returns any Successful Response
     * @throws ApiError
     */
    public static shopifyLogin1(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/shopify/app/login',
        });
    }
    /**
     * Fields
     * @returns any Successful Response
     * @throws ApiError
     */
    public static shopifyFields(): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/shopify/fields',
        });
    }
    /**
     * Customer Request
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static shopifyCustomerRequest(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/shopify/customer-request',
        });
    }
    /**
     * Customer Erase
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static shopifyCustomerErase(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/shopify/customer-erase',
        });
    }
    /**
     * Shop Erase
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static shopifyShopErase(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/shopify/shop-erase',
        });
    }
    /**
     * Charge Approval
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static shopifyChargeApproval(): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/shopify/charge-approval',
        });
    }
}
