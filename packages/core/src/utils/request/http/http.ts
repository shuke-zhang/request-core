import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ContentTypeEnum, DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequestMethodsEnum, ResponseError } from "../shared";
import { DefaultHttpRequestConfig, HttpRequestConfig, HttpRequestConfigWithoutMethod, HttpRequestInterceptors, HttpRequestSimpleConfig } from "./http-types";
import Qs from 'qs'
import merge from 'lodash.merge'
export class HttpRequest<
  /**
   * 用户自定义配置
   */
  UserConfig extends object = DefaultUserConfig,
  /**
   * 用户自定义响应
   */
  UserResponseResult extends object = DefaultResponseResult,
> {
  /**
   * @description axios 实例
   */
  private axiosInstance: AxiosInstance
  /**
   * @description 基础配置
   */
  private baseConfig: DefaultHttpRequestConfig<UserConfig>

    constructor(
    options: DefaultHttpRequestConfig<UserConfig>,
    interceptors?: HttpRequestInterceptors<UserConfig>,
  ) {
    this.baseConfig = {
      ...options,
    }

    this.axiosInstance = axios.create(this.baseConfig)

    const {
      request,
      response,
      requestError,
      responseError,
    } = interceptors || {}

    // https://www.axios-http.cn/docs/interceptors
    this.axiosInstance.interceptors.request.use(async (config) => {
      const value = await (request?.(config as HttpRequestConfig<UserConfig>) || config)
      return value as InternalAxiosRequestConfig
    }, (e) => {
      requestError?.(e)
    })
    this.axiosInstance.interceptors.response.use((data) => {
      return (response?.(data) || data)
    }, ((error: ResponseError<HttpRequestConfig<UserConfig>>) => {
      return responseError?.(error) || Promise.reject(error)
    }) as any)
  }

   /**
   * get 请求
   * @param config
   */
  get<D extends object>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  get<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  get<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.GET })
  }

  /**
   * header 请求
   * @param config
   */
  header<D extends object>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  header<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  header<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.HEAD })
  }

  /**
   * options 请求
   * @param config
   */
  options<D extends object>(config: HttpRequestSimpleConfig<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  options<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<UserResponseResult & D>
  options<D extends object>(config: HttpRequestSimpleConfig<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.OPTIONS })
  }

  /**
   * post 请求
   * @param config
   */
  post<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  post<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  post<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.POST })
  }

  /**
   * put 请求
   * @param config
   */
  put<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  put<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  put<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.PUT })
  }

  /**
   * delete 请求
   * @param config
   */
  delete<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig> & GetResponseConfig): Promise<AxiosResponse<UserResponseResult & D>>
  delete<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<UserResponseResult & D>
  delete<D extends object>(config: HttpRequestConfigWithoutMethod<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    return this.request({ ...config, method: RequestMethodsEnum.DELETE })
  }

/**
 * @description 请求
 */
    request<D extends object>(config: HttpRequestConfig<UserConfig> & {
    getResponse: true
  }): Promise<AxiosResponse<UserResponseResult & D>>
       request<D extends object>(config: HttpRequestConfig<UserConfig>): Promise<UserResponseResult & D>
  request<D extends object>(config: HttpRequestConfig<UserConfig>): Promise<AxiosResponse<D> | UserResponseResult & D> {
    const _config = merge({}, this.baseConfig, this.formatFormData(config))
    return this.axiosInstance.request(_config)
  }

  
  /**
   * 格式化 formdata
   * @param config
   */
  formatFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.baseConfig.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']
    if (
      (contentType !== ContentTypeEnum.FORM_URLENCODED)
      || (config.data && typeof config.data == 'object' && Object.keys(config.data).length)
      || config.method?.toUpperCase() === RequestMethodsEnum.GET
    ) {
      return config as HttpRequestConfig<UserConfig>
    }
    return {
      ...config,
      data: Qs.stringify(config.data, { arrayFormat: 'brackets' }),
    } as HttpRequestConfig<UserConfig>
  }
}