import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import Vue from 'vue'

const config = {
  baseURL: process.env.VUE_APP_API, // 配置API接口地址
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
}

axios.defaults.withCredentials = true

const service = axios.create(config)
service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config
  },
  (error) => {
    console.log("xxxx" , error) // for debug
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.code !== 0) {
      const errInfo = res.detail
        ? res.detail
            .map((v) => {
              return '<br>' + v.field + ' ' + v.message
            })
            .join('')
        : ''
      Vue.$toast.error(res.error + errInfo)
    }
    return response
  },
  (error) => {
    Notification({
      type: 'error',
      title: '网络错误',
      message: error.message || '网络错误，请稍后再试',
    })
    return Promise.reject(error)
  }
)

export default service
