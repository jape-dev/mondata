/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_run_run } from '../models/Body_run_run';
import type { Body_run_schedule } from '../models/Body_run_schedule';
import type { Body_run_test_run_import } from '../models/Body_run_test_run_import';
import type { RunResponse } from '../models/RunResponse';
import type { Schedule } from '../models/Schedule';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RunService {
    /**
     * Run
     * @param sessionToken
     * @param requestBody
     * @param boardName
     * @returns RunResponse Successful Response
     * @throws ApiError
     */
    public static runRun(
        sessionToken: string,
        requestBody: Body_run_run,
        boardName?: (string | null),
    ): CancelablePromise<RunResponse> {
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
    /**
     * Import Data
     * @param scheduleId
     * @param query
     * @param user
     * @param accessToken
     * @param boardName
     * @returns any Successful Response
     * @throws ApiError
     */
    public static runImportData(
        scheduleId: number,
        query: string,
        user: string,
        accessToken: string,
        boardName?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/run/test_celery_import',
            query: {
                'schedule_id': scheduleId,
                'query': query,
                'user': user,
                'access_token': accessToken,
                'board_name': boardName,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Schedules
     * @param sessionToken
     * @returns Schedule Successful Response
     * @throws ApiError
     */
    public static runGetUserSchedules(
        sessionToken: string,
    ): CancelablePromise<Array<Schedule>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/run/schedules',
            query: {
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Schedule
     * @param scheduleId
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static runDeleteSchedule(
        scheduleId: number,
        sessionToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/run/schedule/{schedule_id}',
            path: {
                'schedule_id': scheduleId,
            },
            query: {
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
