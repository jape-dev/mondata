/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The HTTP authorization credentials in the result of using `HTTPBearer` or
 * `HTTPDigest` in a dependency.
 *
 * The HTTP authorization header value is split by the first space.
 *
 * The first part is the `scheme`, the second part is the `credentials`.
 *
 * For example, in an HTTP Bearer token scheme, the client will send a header
 * like:
 *
 * ```
 * Authorization: Bearer deadbeef12346
 * ```
 *
 * In this case:
 *
 * * `scheme` will have the value `"Bearer"`
 * * `credentials` will have the value `"deadbeef12346"`
 */
export type HTTPAuthorizationCredentials = {
    scheme: string;
    credentials: string;
};

