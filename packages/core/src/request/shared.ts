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

/**
 * 从响应头中解析文件名。
 * 兼容 Content-Disposition 的 filename 和 RFC5987 的 filename* 两种格式。
 * 例：
 *   attachment; filename="报告.pdf"
 *   attachment; filename*=UTF-8''%E6%8A%A5%E5%91%8A.pdf
 */
export function getResponseFilename(
  data: { headers: Record<string, string | string[] | undefined> },
  key = 'content-disposition',
): string | undefined {
  const headers = data?.headers || {}
  let headerVal = headers[key] as string | string[] | undefined
  if (!headerVal)
    headerVal = headers[key.toLowerCase()] as string | string[] | undefined
  if (!headerVal) {
    const found = Object.entries(headers).find(([k]) => k.toLowerCase() === key.toLowerCase())
    if (found)
      headerVal = found[1] as string | string[] | undefined
  }
  if (!headerVal)
    return undefined

  const value = Array.isArray(headerVal) ? headerVal[0] : String(headerVal)
  if (!value)
    return undefined

  // 优先解析 RFC 5987：filename*=charset'lang'%XX...
  const filenameStarMatch = value.match(/filename\*\s*=\s*([\w!#$%&+.^`|~-]+)'(?:[A-Z]{1,8}(?:-[A-Z0-9]{1,8})*)?'([^;]+)/i)
  if (filenameStarMatch) {
    const charset = (filenameStarMatch[1] || 'utf-8').toLowerCase().trim()
    const encoded = filenameStarMatch[2].trim().replace(/^"(.*)"$/, '$1')
    const decoded = decode5987(encoded, charset)
    const safe = sanitizeFilename(decoded)
    return safe || undefined
  }

  // 退回常见的 filename=...
  const filenameMatch = value.match(/filename\s*=\s*("?)([^";]+)\1/i)
  if (filenameMatch) {
    const raw = filenameMatch[2].trim()
    const decoded = safeDecodeURIComponent(raw)
    const safe = sanitizeFilename(decoded)
    return safe || undefined
  }

  return undefined
}

/** 解码 RFC5987 百分号编码；尽量按 charset 处理，否则回退 UTF-8 */
function decode5987(encoded: string, charset: string): string {
  const clean = encoded.replace(/\s/g, '')
  if (charset === 'utf-8' || charset === 'utf8')
    return safeDecodeURIComponent(clean)
  try {
    const bytes = percentToBytes(clean)
    if (typeof TextDecoder !== 'undefined') {
      const dec = new TextDecoder(charset as any, { fatal: false })
      const text = dec.decode(bytes)
      return text
    }
  }
  catch {
    /* ignore */
  }
  return safeDecodeURIComponent(clean)
}

/** 将 %XX 串转为字节数组 */
function percentToBytes(s: string): Uint8Array {
  const out: number[] = []
  let i = 0
  while (i < s.length) {
    const ch = s[i]
    if (ch === '%' && i + 2 < s.length) {
      const hex = s.slice(i + 1, i + 3)
      const val = Number.parseInt(hex, 16)
      if (!Number.isNaN(val)) {
        out.push(val)
        i += 3
        continue
      }
    }
    out.push(s.charCodeAt(i))
    i += 1
  }
  return new Uint8Array(out)
}

/** 安全解码 URI 组件，失败则原样返回 */
function safeDecodeURIComponent(s: string): string {
  try {
    return decodeURIComponent(s)
  }
  catch {
    return s
  }
}

/** 清理危险字符与包裹引号、去除 CRLF/路径分隔符 */
function sanitizeFilename(name: string): string {
  if (!name)
    return ''
  let n = name.replace(/^['"]|['"]$/g, '')
  n = n.replace(/\r|\n/g, '')
  n = n.replace(/[\\/]+/g, '_')
  n = n.replace(/[:*?"<>|]+/g, '_')
  n = n.trim()
  return n
}
