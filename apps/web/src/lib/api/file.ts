import { Folder } from '@/type'
import http from './http'

export const createFolder = (name: string, path: string): Promise<Folder> => {
  return http
    .post('/file/folder', {
      name,
      path
    })
    .then(res => res.data)
}

export const findFiles = (path: string) => {
  return http
    .get('/file', {
      params: {
        path
      }
    })
    .then(res => res.data)
}
