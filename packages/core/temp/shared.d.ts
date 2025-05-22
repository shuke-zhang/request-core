import type { AxiosRequestConfig, Canceler } from 'axios';
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
/**
 * 获取系统错误信息
 * @param status 错误状态码
 */
export declare function getSystemErrorMessage(status: number): "未知错误" | "错误请求，服务器无法理解请求的格式" | "无效的会话，或者会话已过期，请重新登录。" | "当前操作没有权限" | "服务器无法根据客户端的请求找到资源" | "网络请求错误,请求方法未允许!" | "网络请求超时!" | "服务器内部错误，无法完成请求" | "网关错误" | "服务器目前无法使用（由于超载或停机维护）" | "网络超时!" | "http版本不支持该请求!";
export declare function handleError(msg: string, showMessageError: (message: string) => void, showErrorMsg?: boolean): void;
/**
 * @description 生成 key 用于取消请求
 * @param config
 * @returns string
 */
export declare function generateKey(config: AxiosRequestConfig): string;
/**
 * @description 取消请求
 * @param key 生成的 key
 * @param canceler 取消函数
 * @param cancelMap 取消请求的 map
 */
export declare function cancelInterceptor(key: string, canceler: Canceler, cancelMap?: Map<string, Canceler>): void;
