/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_run_run } from '../models/Body_run_run';
import type { Body_run_schedule } from '../models/Body_run_schedule';
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
    /**
     * Schedule Run
     * @param scheduleId
     * @param query
     * @param user
     * @param accessToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static runScheduleRun(
        scheduleId: number,
        query: string,
        user: string,
        accessToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/run/schedule/run/',
            query: {
                'schedule_id': scheduleId,
                'query': query,
                'user': user,
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
