/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ColumnData } from '../models/ColumnData';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class MondayService {
    /**
     * Test
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayTest(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/public_json',
        });
    }
    /**
     * Login
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayLogin(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/login',
        });
    }
    /**
     * Callback
     * @param code
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayCallback(
        code: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/callback',
            query: {
                'code': code,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Boards
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayBoards(
        sessionToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/boards',
            query: {
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Items
     * @param boardId
     * @param columnId
     * @param sessionToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayItems(
        boardId: string,
        columnId: string,
        sessionToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/items',
            query: {
                'board_id': boardId,
                'column_id': columnId,
                'session_token': sessionToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Board Columns
     * @param boardId
     * @param sessionToken
     * @param type
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayBoardColumns(
        boardId: string,
        sessionToken: string,
        type?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/boards/{board_id}/columns',
            path: {
                'board_id': boardId,
            },
            query: {
                'session_token': sessionToken,
                'type': type,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Data
     * @param boardId
     * @param sessionToken
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayAddData(
        boardId: string,
        sessionToken: string,
        requestBody: Array<ColumnData>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/monday/add-data',
            query: {
                'board_id': boardId,
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
     * Create Board With Data
     * @param boardName
     * @param sessionToken
     * @param requestBody
     * @returns number Successful Response
     * @throws ApiError
     */
    public static mondayCreateBoardWithData(
        boardName: string,
        sessionToken: string,
        requestBody: Array<ColumnData>,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/monday/create-board',
            query: {
                'board_name': boardName,
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
     * Webhook
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayWebhook(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/monday/webhook',
        });
    }
}
