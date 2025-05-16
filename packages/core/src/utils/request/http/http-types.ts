import type {
  AxiosRequestConfig,
} from 'axios'
/**
 * 基础的RequestConfig 配置
 */
export interface HttpRequestBaseConfig extends AxiosRequestConfig {
  /**
   * @description 是否返回原生响应 AxiosResponse<T> 默认false
   */
  getResponse?: boolean
}