import axios from 'axios'
import { refreshAuth } from './auth'
import { getTokens, removeTokens } from '../token'

const http = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
})

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
    if (status === 401 && config.url !== '/auth/refresh/token') {
      try {
        await refreshAuth()
        const { accessToken } = getTokens()
        config.headers.Authorization = 'Bearer ' + accessToken
        return axios(config)
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
