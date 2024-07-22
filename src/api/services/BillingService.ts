/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserPublic } from '../models/UserPublic';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BillingService {
    /**
     * Valid Plan
     * @param boardId
     * @param requestBody
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static billingValidPlan(
        boardId: number,
        requestBody: UserPublic,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/billing/valid_plan',
            query: {
                'board_id': boardId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
