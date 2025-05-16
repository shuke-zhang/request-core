import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { RequiredProperty, ResponseError } from '../shared';
/**
 * 基础的RequestConfig 配置
 */
export interface HttpRequestBaseConfig extends AxiosRequestConfig {
    /**
     * @description 是否返回原生响应 AxiosResponse<T> 默认false
     */
    getResponse?: boolean;
}
/**
 * 用户自定义请求配置(完整的配置，用于拦截器)
 */
export type HttpRequestConfig<T extends object> = HttpRequestBaseConfig & T;
/**
 * 默认配置
 */
export type DefaultHttpRequestConfig<T extends object> = Omit<HttpRequestBaseConfig, 'method' | 'url' | 'params' | 'data'> & T;
/**
 * 简单请求（ GET OPTIONS HEAD ）的配置
 */
export type HttpRequestSimpleConfig<T extends object> = RequiredProperty<Omit<HttpRequestBaseConfig, 'method' | 'data'>, 'url'> & T;
/**
 * HttpRequestConfigWithoutMethod 配置
 * 去除 method 为了给具体请求函数使用 get / post ...
 */
export type HttpRequestConfigWithoutMethod<T extends object> = RequiredProperty<Omit<HttpRequestBaseConfig, 'method'>, 'url'> & T;
/**
 * 拦截器
 */
export interface HttpRequestInterceptors<T extends object> {
    request?: (value: HttpRequestConfig<T>) => HttpRequestConfig<T> | Promise<HttpRequestConfig<T>>;
    requestError?: (error: any) => (Promise<any> | any);
    response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined;
    responseError?: (error: ResponseError<HttpRequestConfig<T>>) => (Promise<any> | any);
}
