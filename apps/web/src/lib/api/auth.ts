import { Tokens } from '@/type'
import http from './http'
import { getTokens, removeTokens, setTokens } from '../token'

export const getLoginCode = async (email: string): Promise<string> => {
  const { data } = await http.get('/auth/login/code', {
    params: { email }
  })
  return data
}

export const login = async (email: string, code: string): Promise<Tokens> => {
  const { data } = await http.post('/auth/login', {
    email,
    code
  })
  return data
}

export const logout = async () => {
  const tokens = getTokens()
  http.post('/auth/logout', tokens)
  removeTokens()
  window.location.href = '/login'
}

export const refreshAuth = async () => {
  const res = await http.get('/auth/refresh/token')
  console.log(res)
  setTokens({
    accessToken: res.data.accessToken,
    refreshToken: res.data.refreshToken
  })
  return res
}
