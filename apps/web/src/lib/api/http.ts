import axios, { AxiosRequestConfig } from 'axios'
import { refreshAuth } from './auth'
import { getTokens, removeTokens } from '../token'

const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

type PendingTask = {
  config: AxiosRequestConfig
  resolve: (value: unknown) => void
}

let refreshing = false
const reqQueue: PendingTask[] = []

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

    if (refreshing) {
      return new Promise(resolve => {
        reqQueue.push({
          config,
          resolve
        })
      })
    }
    refreshing = true
    if (status === 401 && config.url !== '/auth/refresh/token') {
      refreshing = true
      try {
        await refreshAuth()
        refreshing = false

        reqQueue.forEach(({ config, resolve }) => {
          resolve(http(config))
        })

        return http(config)
      } catch (error) {
        alert('token 失效了')
        removeTokens()
        setTimeout(() => {
          window.location.href = '/login'
        })
      }
    } else {
      return Promise.reject(error)
    }
  }
)

export default http
