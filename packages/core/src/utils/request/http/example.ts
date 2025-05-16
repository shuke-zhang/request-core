import { useHttpRequest } from './hooks'

function getToken() {
  console.log('getToken')
  return 'token'
}
const { request } = useHttpRequest(
  {
    baseURL: 'http://vue.ruoyi.vip',
    withToken: false,
  },
  { getToken },
)

function getCode() {
  return request.get<{ img: string, uuid: string }>({
    url: '/prod-api/captchaImage',
    withToken: false,
  })
}

getCode().then((res) => {
  console.log('调用成功', res.uuid, res.img)
})
