import { FindUserParams, OtherUser } from '@/type'
import http from './http'

export const initName = async (name: string) => {
  return await http.post('/user/name', { name })
}

export const findOtherUser = async (
  params: FindUserParams
): Promise<OtherUser> => {
  return await http
    .get('/user/other', {
      params
    })
    .then(res => res.data)
}
