import type { AxiosRequestConfig, Canceler } from 'axios'

/**
 * @description 请求方法
 */
export enum RequestMethodsEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
}

/**
 * @description headers ContentType - 请求头 ContentType
 */
export enum ContentTypeEnum {
  JSON = 'application/json;charset=UTF-8',
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
}

export interface DefaultUserConfig {}

/**
 * 帮助函数
 */
export type RequiredProperty<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 *  返回原生响应
 */
export interface GetResponseConfig {
  getResponse: true
};
/**
 * 默认响应结构
 */
export interface DefaultResponseResult {
  /**
   * 开发者服务器 状态码
   */
  code: number
  /**
   * 开发者服务器 消息
   */
  msg: string
}

/**
 * 错误类
 */
export class ResponseError<T> extends Error {
  public errMsg?: string
  public msg?: string
  constructor(
    public message: string,
    public config?: T,
  ) {
    super(message)
  }

  get errorMessage(): string {
    return this.message || this.errMsg || this.msg || '未知错误'
  }
}

/**
 * 获取系统错误信息
 * @param status 错误状态码
 */
export function getSystemErrorMessage(status: number) {
  switch (status) {
    case 400:
      return '错误请求，服务器无法理解请求的格式'
    case 401:
      return '无效的会话，或者会话已过期，请重新登录。'
    case 403:
      return '当前操作没有权限'
    case 404:
      return '服务器无法根据客户端的请求找到资源'
    case 405:
      return '网络请求错误,请求方法未允许!'
    case 408:
      return '网络请求超时!'
    case 500:
      return '服务器内部错误，无法完成请求'
    case 502:
      return '网关错误'
    case 503:
      return '服务器目前无法使用（由于超载或停机维护）'
    case 504:
      return '网络超时!'
    case 505:
      return 'http版本不支持该请求!'
    default:
      return '未知错误'
  }
}

export function handleError(msg: string, showMessageError: (message: string) => void, showErrorMsg = true) {
  showErrorMsg && showMessageError(msg)
  throw new Error(msg)
}

/**
 * @description 生成 key 用于取消请求
 * @param config
 * @returns string
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
