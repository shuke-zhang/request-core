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