import { FindUserParams, OtherUser, User } from '@/type'
import http from './http'

export const findMe = (url: string): Promise<User> => {
  return http.get(url).then(res => res.data)
}

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

export const findFriendList = async (): Promise<User[]> => {
  return await http.get('/user/friend').then(res => res.data)
}
