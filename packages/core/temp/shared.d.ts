/**
 * @description 请求方法
 */
export declare enum RequestMethodsEnum {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS",
    HEAD = "HEAD"
}
/**
 * @description headers ContentType - 请求头 ContentType
 */
export declare enum ContentTypeEnum {
    JSON = "application/json;charset=UTF-8",
    FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
    FORM_DATA = "multipart/form-data;charset=UTF-8"
}
export interface DefaultUserConfig {
}
/**
 * 帮助函数
 */
export type RequiredProperty<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
/**
 *  返回原生响应
 */
export interface GetResponseConfig {
    getResponse: true;
}
/**
 * 默认响应结构
 */
export interface DefaultResponseResult {
    /**
     * 开发者服务器 状态码
     */
    code: number;
    /**
     * 开发者服务器 消息
     */
    msg: string;
}
/**
 * 错误类
 */
export declare class ResponseError<T> extends Error {
    message: string;
    config?: T | undefined;
    errMsg?: string;
    msg?: string;
    constructor(message: string, config?: T | undefined);
    get errorMessage(): string;
}
