/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_run_run } from '../models/Body_run_run';
import type { Body_run_schedule } from '../models/Body_run_schedule';
import type { Body_run_test_run_import } from '../models/Body_run_test_run_import';
import type { ColumnData } from '../models/ColumnData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RunService {
    /**
     * Run
     * @param sessionToken
     * @param requestBody
     * @param boardName
     * @returns ColumnData Successful Response
     * @throws ApiError
     */
    public static runRun(
        sessionToken: string,
        requestBody: Body_run_run,
        boardName?: (string | null),
    ): CancelablePromise<Array<ColumnData>> {
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
            url: '/api/v1/run/schedule/create',
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
    /**
     * Test Run Import
     * @param accessToken
     * @param requestBody
     * @param boardId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static runTestRunImport(
        accessToken: string,
        requestBody: Body_run_test_run_import,
        boardId?: any,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/run/test_run_import',
            query: {
                'access_token': accessToken,
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
