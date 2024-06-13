/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Run } from '../models/Run';
import type { RunBase } from '../models/RunBase';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RunService {
    /**
     * Run
     * @param requestBody
     * @returns Run Successful Response
     * @throws ApiError
     */
    public static runRun(
        requestBody: RunBase,
    ): CancelablePromise<Run> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/run/run',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
