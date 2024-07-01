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
     * @param accessToken
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayBoards(
        accessToken: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/boards',
            query: {
                'access_token': accessToken,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Items
     * @param accessToken
     * @param boardId
     * @param columnId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayItems(
        accessToken: string,
        boardId: string,
        columnId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/items',
            query: {
                'access_token': accessToken,
                'board_id': boardId,
                'column_id': columnId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Board Columns
     * @param boardId
     * @param accessToken
     * @param type
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayBoardColumns(
        boardId: string,
        accessToken: string,
        type?: (string | null),
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/monday/boards/{board_id}/columns',
            path: {
                'board_id': boardId,
            },
            query: {
                'access_token': accessToken,
                'type': type,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Data
     * @param accessToken
     * @param boardId
     * @param requestBody
     * @returns any Successful Response
     * @throws ApiError
     */
    public static mondayAddData(
        accessToken: string,
        boardId: string,
        requestBody: Array<ColumnData>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/monday/add-data',
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
     * Create Board With Data
     * @param accessToken
     * @param boardName
     * @param requestBody
     * @returns number Successful Response
     * @throws ApiError
     */
    public static mondayCreateBoardWithData(
        accessToken: string,
        boardName: string,
        requestBody: Array<ColumnData>,
    ): CancelablePromise<number> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/monday/create-board',
            query: {
                'access_token': accessToken,
                'board_name': boardName,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
