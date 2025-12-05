import type { AxiosRequestConfig, Canceler } from 'axios'
import type { HttpRequestConfig } from '../request'
import axios from 'axios'
import { cancelInterceptor, ContentTypeEnum, generateKey, getSystemErrorMessage, handleError, HttpRequest, RequestMethodsEnum } from '../request'

interface userCustomConfig {
  /**
   * @description 是否需要携带token
   */
  withToken?: boolean
  /**
   * @description 是否添加时间戳
   */
  joinTime?: boolean
  /**
   * @description 是否提示错误信息
   */
  showErrorMsg?: boolean
  /**
   * @description 是否提示请求拦截器错误信息 - 弹窗方式
   */
  isShowRequestErrorMsg?: boolean
  /**
   * @description 忽略重复请求。第一个请求未完成时进行第二个请求，第一个会被被取消
   *              参考 axios 取消请求 https://axios-http.com/zh/docs/cancellation
   */
  ignoreRepeatRequest?: boolean
  /**
   * 下载文件名称
   */
  filename?: string
};

interface userRequestOptions extends AxiosRequestConfig, userCustomConfig {}

interface userRequestConfig {
  getToken: () => string | null
  tokenKey?: string
  tokenKeyScheme?: string
}

interface userToolMethodConfig {
  showMessageSuccess?: (message: string) => void
  showMessageError?: (message: string) => void
  toAuth: () => void
  requestError?: (error: any) => (Promise<any> | any)
}

type ResponseResult<T extends object = object> = {
  code: number
  status: number
  msg: string
  message: string
} & T

const cancelMap = new Map<string, Canceler>()

/**
 * @description shuke 自定义初始化请求
 * @param options 基础配置
 * @param userRequestOptionConfig 自定义请求配置
 * @param userMethodConfig 自定义方法配置
 */
export function useHttpRequest(options: userRequestOptions, userRequestOptionConfig: userRequestConfig, userMethodConfig?: userToolMethodConfig) {
  const request = new HttpRequest<userCustomConfig>(
    {
      baseURL: options.baseURL || 'http://vue.ruoyi.vip',
      timeout: options.timeout || 3000 * 10,
      headers: options.headers || {
        'Content-Type': ContentTypeEnum.JSON,
      },
      onUploadProgress: (progressEvent) => {
        return options.onDownloadProgress?.(progressEvent)
        // 上传进度
      },
      onDownloadProgress(progressEvent) {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          console.log(`Download Progress: ${progress}%`)
          options.onUploadProgress?.(progressEvent)
        }
      },
      withToken: options.withToken || true,
      joinTime: options.joinTime || true,
      ignoreRepeatRequest: options.ignoreRepeatRequest || true,
      showErrorMsg: options.showErrorMsg || true,
    },
    {
      // 请求拦截器
      request(config) {
        /**
         * token
         */
        const token = userRequestOptionConfig.getToken()
        if (config?.withToken && token) {
          config.headers![userRequestOptionConfig.tokenKey || 'Authorization'] = `${userRequestOptionConfig.tokenKeyScheme || 'Bearer'} ${token}`
        }
        /**
         * 忽略重复请求。第一个请求未完成时进行第二个请求，第一个会被被取消
         */
        if (config.ignoreRepeatRequest) {
          const key = generateKey({ ...config })
          const cancelToken = new axios.CancelToken(c => cancelInterceptor(key, c, cancelMap)) // 创建一个取消 token
          config.cancelToken = cancelToken
        }
        /**
         * 添加时间戳到 get 请求
         */
        if (config.method?.toUpperCase() === RequestMethodsEnum.GET) {
          config.params = { _t: `${Date.now()}`, ...config.params }
        }

        return config
      },
      // 请求拦截器错误
      requestError(e) {
        // 处理请求错误
        userMethodConfig?.requestError?.(e) || Promise.reject(e)
      },
      // 相应拦截器
      async response(_response) {
        cancelMap.delete(generateKey(_response.config))
        const config = _response.config as HttpRequestConfig<userCustomConfig>
        // 返回原生响应
        if (config.getResponse) {
          return _response
        }
        const responseData = _response.data as ResponseResult<object>

        if (responseData.code === 200) {
          return responseData as any
        }

        if (responseData.code === 401) {
          // 返回登录页
          userMethodConfig?.toAuth()
        }

        const msg = responseData.msg || getSystemErrorMessage(responseData.code)
        return handleError(msg, userMethodConfig?.showMessageError || (() => {
          console.log(msg)
        }), responseData.code !== 401 && !config?.showErrorMsg)
      },
      // 响应拦截器错误
      responseError(error: any) {
        if (error) {
          const err = error?.errMsg || error?.msg || error?.message || ''
          return handleError(err, userMethodConfig?.showMessageError || (() =>
            console.log(err)))
        }
      },
    },
  )

  return {
    request,
  }
}
