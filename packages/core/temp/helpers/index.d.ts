import type { AxiosRequestConfig, Canceler } from 'axios';
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
