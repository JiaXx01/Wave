import { Folder } from '@/type'
import http from './http'

export const createFolder = async (
  name: string,
  path: string
): Promise<Folder> => {
  return http
    .post('/file/folder', {
      name,
      path
    })
    .then(res => res.data)
}

export const findFiles = async (path: string) => {
  return http
    .get('/file', {
      params: {
        path,
        skip: 1,
        take: 1
      }
    })
    .then(res => res.data)
}
