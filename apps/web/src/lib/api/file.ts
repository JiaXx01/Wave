import {
  CreateFileParams,
  FileInfo,
  FindKeywordResult,
  FolderInfo,
  FolderTree
} from '@/type'
import http from './http'

export const createFolder = async (
  name: string,
  parentId?: string
): Promise<FolderInfo> => {
  return http
    .post('/file/folder', {
      name,
      parentId
    })
    .then(res => res.data)
}

export const createFile = async (fileInfo: CreateFileParams) => {
  return http.post('/file', fileInfo).then(res => res.data)
}

export const findFiles = async (
  folderId?: string
): Promise<{ files: FileInfo[]; folders: FolderInfo[] }> => {
  return http
    .get('/file', {
      params: {
        folderId
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

export const mergeChunks = async (fileInfo: CreateFileParams) => {
  return http.post('/file/chunk/merge', fileInfo).then(res => res.data)
}

export const checkFileHash = async (
  hash: string
): Promise<
  | true
  | {
      list: string[]
      loaded: number
    }
> => {
  return http.get('/file/check/' + hash).then(res => res.data)
}

export const deleteFiles = async (ids: string[]) => {
  return http.delete('/file', {
    data: { ids }
  })
}

export const deleteFolders = async (ids: string[]) => {
  return http.delete('/file/folder', {
    data: { ids }
  })
}

export const renameFile = async (id: string, name: string) => {
  return http.put(`/file/${id}/name`, { name }).then(res => res.data)
}

export const findKeyword = async (
  keyword: string
): Promise<FindKeywordResult[]> => {
  return http
    .get('/file/search', {
      params: { keyword }
    })
    .then(res => res.data)
}

export const getFolderTree = async (): Promise<FolderTree[]> => {
  return http.get('/file/folder-tree').then(res => res.data)
}

export const removeFile = async (id: string, targetId?: string) => {
  return http.put(`/file/${id}/remove-to`, { targetId }).then(res => res.data)
}

export const getDownloadUrl = async (id: string): Promise<{ url: string }> => {
  return http.get(`/file/${id}/download-url`).then(res => res.data)
}
