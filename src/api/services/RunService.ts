/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_run_run } from '../models/Body_run_run';
import type { Body_run_schedule } from '../models/Body_run_schedule';
import type { Run } from '../models/Run';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RunService {
    /**
     * Run
     * @param sessionToken
     * @param requestBody
     * @param boardName
     * @returns Run Successful Response
     * @throws ApiError
     */
    public static runRun(
        sessionToken: string,
        requestBody: Body_run_run,
        boardName?: (string | null),
    ): CancelablePromise<Run> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/run/run',
            query: {
                'session_token': sessionToken,
                'board_name': boardName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Schedule
     * @param sessionToken
     * @param requestBody
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static runSchedule(
        sessionToken: string,
        requestBody: Body_run_schedule,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/run/schedule',
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
