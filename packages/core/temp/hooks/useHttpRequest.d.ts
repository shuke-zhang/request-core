import type { AxiosRequestConfig } from 'axios';
import { HttpRequest } from '../request';
interface userCustomConfig {
    /**
     * @description 是否需要携带token
     */
    withToken?: boolean;
    /**
     * @description 是否添加时间戳
     */
    joinTime?: boolean;
    /**
     * @description 是否提示错误信息
     */
    showErrorMsg?: boolean;
    /**
     * @description 是否提示请求拦截器错误信息 - 弹窗方式
     */
    isShowRequestErrorMsg?: boolean;
    /**
     * @description 忽略重复请求。第一个请求未完成时进行第二个请求，第一个会被被取消
     *              参考 axios 取消请求 https://axios-http.com/zh/docs/cancellation
     */
    ignoreRepeatRequest?: boolean;
    /**
     * 下载文件名称
     */
    filename?: string;
}
interface userRequestOptions extends AxiosRequestConfig, userCustomConfig {
}
interface userRequestConfig {
    getToken: () => string | null;
    tokenKey?: string;
    tokenKeyScheme?: string;
}
interface userToolMethodConfig {
    showMessageSuccess?: (message: string) => void;
    showMessageError?: (message: string) => void;
    toAuth: () => void;
    requestError?: (error: any) => (Promise<any> | any);
}
/**
 * @description shuke 自定义初始化请求
 * @param options 基础配置
 * @param userRequestOptionConfig 自定义请求配置
 * @param userMethodConfig 自定义方法配置
 */
export declare function useHttpRequest(options: userRequestOptions, userRequestOptionConfig: userRequestConfig, userMethodConfig?: userToolMethodConfig): {
    request: HttpRequest<userCustomConfig, import("../request").DefaultResponseResult>;
};
export {};
