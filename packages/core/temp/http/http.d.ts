import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type { DefaultResponseResult, DefaultUserConfig, GetResponseConfig } from '../shared';
import type { DefaultHttpRequestConfig, HttpRequestConfig, HttpRequestConfigWithoutMethod, HttpRequestInterceptors, HttpRequestSimpleConfig } from './http-types';
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
