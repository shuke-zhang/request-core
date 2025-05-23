import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

import type { DefaultResponseResult, DefaultUserConfig, GetResponseConfig, RequiredProperty, ResponseError } from './shared'
import axios from 'axios'
import merge from 'lodash.merge'
import Qs from 'qs'
import { ContentTypeEnum, RequestMethodsEnum } from './shared'

export * from './shared'

/**
 * 基础的RequestConfig 配置
 */
export interface HttpRequestBaseConfig extends AxiosRequestConfig {
  /**
   * @description 是否返回原生响应 AxiosResponse<T> 默认false
   */
  getResponse?: boolean
}

/**
 * 用户自定义请求配置(完整的配置，用于拦截器)
 */
export type HttpRequestConfig<T extends object> = HttpRequestBaseConfig & T

/**
 * 默认配置
 */
export type DefaultHttpRequestConfig<T extends object> =
  Omit<
    HttpRequestBaseConfig,
    'method' | 'url' | 'params' | 'data'
  > & T

/**
 * 简单请求（ GET OPTIONS HEAD ）的配置
 */
export type HttpRequestSimpleConfig<T extends object> =
 RequiredProperty<Omit<HttpRequestBaseConfig, 'method' | 'data'>, 'url'> & T

/**
 * HttpRequestConfigWithoutMethod 配置
 * 去除 method 为了给具体请求函数使用 get / post ...
 */
export type HttpRequestConfigWithoutMethod<T extends object> =
  RequiredProperty<Omit<HttpRequestBaseConfig, 'method'>, 'url'> & T

/**
 * 拦截器
 */
export interface HttpRequestInterceptors<T extends object> {
  request?: (value: HttpRequestConfig<T>) => HttpRequestConfig<T> | Promise<HttpRequestConfig<T>>
  requestError?: (error: any) => (Promise<any> | any)
  response?: ((value: AxiosResponse<any, any>) => AxiosResponse<any, any> | Promise<AxiosResponse<any, any>>) | null | undefined
  responseError?: (error: ResponseError<HttpRequestConfig<T>>) => (Promise<any> | any)
}

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
