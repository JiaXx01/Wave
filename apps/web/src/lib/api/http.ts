import axios, { AxiosRequestConfig } from 'axios'
import { refreshAuth } from './auth'
import { getTokens, removeTokens } from '../token'

const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

let refreshing = false
const reqQueue: AxiosRequestConfig[] = []

http.interceptors.request.use(config => {
  const { accessToken, refreshToken } = getTokens()
  if (config.url === '/auth/refresh/token' && refreshToken) {
    config.headers.Authorization = 'Refresh ' + refreshToken
  } else if (accessToken) {
    config.headers.Authorization = 'Bearer ' + accessToken
  }
  return config
})

http.interceptors.response.use(
  response => response,
  async error => {
    const { config, status } = error.response
    if (config.url == '/auth/refresh/token') {
      removeTokens()
      setTimeout(() => {
        window.location.href = '/login'
      })
    }
    if (refreshing) {
      return reqQueue.push(config)
    }
    if (status === 401) {
      refreshing = true
      try {
        await refreshAuth()
        refreshing = false

        // reqQueue.forEach(({ config, resolve }) => {
        //   resolve(http(config))
        // })

        await Promise.all(reqQueue.map(config => http(config)))
        reqQueue.length = 0

        return http(config)
      } catch (error) {
        alert('token 失效了')
        // removeTokens()
        // setTimeout(() => {
        //   window.location.href = '/login'
        // })
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default http
