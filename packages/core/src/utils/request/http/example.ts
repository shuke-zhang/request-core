import type { AxiosRequestConfig, Canceler } from 'axios'
import axios from 'axios'
import { ContentTypeEnum, RequestMethodsEnum } from '../shared'
import { HttpRequest } from './http'

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

interface userRequestConfig {
  getToken: () => string | null
  tokenKey?: string
  tokenKeyScheme?: string
}

interface userToolMethodConfig {
  showMessageSuccess?: (message: string) => void
  requestError?: (error: any) => (Promise<any> | any)
}

type ResponseResult<T extends object = object> = {
  code: number
  status: number
  msg: string
  message: string
} & T

export function httpRequest(userConfig: userRequestConfig, userMethodConfig?: userToolMethodConfig) {
  const request = new HttpRequest<userCustomConfig>(
    {
      baseURL: 'http://vue.ruoyi.vip',
      timeout: 3000 * 10,
      headers: {
        'Content-Type': ContentTypeEnum.JSON,
      },
      onUploadProgress: (progressEvent) => {
        // 上传进度
        console.log(progressEvent)
      },
      onDownloadProgress(progressEvent) {
        if (progressEvent.total) {
          const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100)
          console.log(`Download Progress: ${progress}%`)
        }
      },
      withToken: true,
      joinTime: true,
      ignoreRepeatRequest: true,
      showErrorMsg: true,
    },
    {
      // 拦截器
      request(config) {
        /**
         * token
         */
        const token = userConfig.getToken()
        if (config?.withToken && token) {
          config.headers![userConfig.tokenKey || 'Authorization'] = `${userConfig.tokenKeyScheme || 'Bearer'} ${token}`
        }
        /**
         * 忽略重复请求。第一个请求未完成时进行第二个请求，第一个会被被取消
         */
        if (config.ignoreRepeatRequest) {
          const key = generateKey({ ...config })
          const cancelToken = new axios.CancelToken(c => cancelInterceptor(key, c)) // 创建一个取消 token
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
      requestError(e) {
        // 处理请求错误
        userMethodConfig?.requestError?.(e) || Promise.reject(e)
      },
    },
  )

  return request
}

/**
 * @description 生成 key 用于取消请求
 * @param config
 * @returns
 */
export function generateKey(config: AxiosRequestConfig) {
  const { url, method, params = {}, data = {} } = config
  return `${url}-${method}-${JSON.stringify(method === 'get' ? params : data)}`
}

/**
 * @description 取消请求
 * @param key 生成的 key
 * @param canceler 取消函数
 * @param cancelMap 取消请求的 map
 */
export function cancelInterceptor(key: string, canceler: Canceler, cancelMap = new Map<string, Canceler>()) {
  if (cancelMap.has(key)) {
    cancelMap.get(key)?.('cancel repeat request')
  }
  cancelMap.set(key, canceler)
}
