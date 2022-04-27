import request from './request'

// 钱包注册
// export function signup(data) {
//   return request({
//     url: '/public/signup',
//     method: 'post',
//     data
//   })
// }

// 钱包登录
export function signin(data) {
  return request({
    url: '/api/public/signin',
    method: 'post',
    data
  })
}

// export function getInfo(token) {
//   return request({
//     url: '/user/current',
//     method: 'get'
//   })
// }

export function logout() {
  return request({
    url: '/api/public/logout',
    method: 'get'
  })
}
