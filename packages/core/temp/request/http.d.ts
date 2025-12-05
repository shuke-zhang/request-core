import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequiredProperty, ResponseError } from './shared';
export * from './shared';
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
export declare class HttpRequest<
/**
 * 用户自定义配置
 */
UserConfig extends object = DefaultUserConfig, 
/**
 * 用户自定义响应
 */
UserResponseResult extends object = DefaultResponseResult> {
    /**
     * @description axios 实例
     */
    private axiosInstance;
    /**
     * @description 基础配置
     */
    private baseConfig;
    constructor(options: DefaultHttpRequestConfig<UserConfig>, interceptors?: HttpRequestInterceptors<UserConfig>);
    /**
     * get 请求
     * @param config
     */
    get<D extends object>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>;
    get<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>;
    /**
     * header 请求
     * @param config
     */
    header<D extends object>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>;
    header<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>;
    /**
     * options 请求
     * @param config
     */
    options<D extends object>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>;
    options<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>;
    /**
     * post 请求
     * @param config
     */
    post<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>;
    post<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>;
    /**
     * put 请求
     * @param config
     */
    put<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>;
    put<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>;
    /**
     * delete 请求
     * @param config
     */
    delete<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>;
    delete<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>;
    /**
     * @description 请求
     */
    request<D extends object>(config: HttpRequestConfig<UserConfig> & {
        getResponse: true;
    }): Promise<AxiosResponse<UserResponseResult & D>>;
    request<D extends object>(config: HttpRequestConfig<UserConfig>): Promise<UserResponseResult & D>;
    /**
     * 格式化 formdata
     * @param config
     */
    formatFormData(config: AxiosRequestConfig): HttpRequestConfig<UserConfig>;
}
