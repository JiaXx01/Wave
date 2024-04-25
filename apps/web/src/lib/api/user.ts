import http from './http'

export const initName = async (name: string) => {
  return await http.post('/user/name', { name })
}
