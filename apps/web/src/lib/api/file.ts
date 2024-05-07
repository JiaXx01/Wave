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
        path
      }
    })
    .then(res => res.data)
}

export const getUploadUrl = async (hash: string) => {
  return http
    .get('/file/presigned-url', {
      params: { hash }
    })
    .then(res => res.data)
}

export const getChunkUploadUrl = async (hashNo: string) => {
  return http
    .get('/file/chunk/presigned-url', {
      params: { hashNo }
    })
    .then(res => res.data)
}

export const mergeChunks = async (hash: string) => {
  return http
    .get('/file/chunk/merge', {
      params: { hash }
    })
    .then(res => res.data)
}
