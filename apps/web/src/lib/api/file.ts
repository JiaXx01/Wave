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
