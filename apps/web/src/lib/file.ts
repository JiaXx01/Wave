import {
  checkFileHash,
  createFile,
  getChunkUploadUrl,
  getUploadUrl,
  mergeChunks
} from './api/file'
import FileHashWorker from './worker/fileHash?worker'
import FileSliceWorker from './worker/fileSlice?worker'
import mime from 'mime'

const CHUNK_SIZE = 5 * 1024 * 1024

export function selectFileFromLocal(options?: {
  accept?: string
  maxSize?: number
}): Promise<File | null> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    if (options?.accept) {
      input.accept = options.accept
    }
    input.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]
      input.remove()
      if (!file) return resolve(null)
      if (options?.maxSize && file.size > options.maxSize)
        return reject('文件过大')
      resolve(file)
    })
    input.click()
  })
}

const calculateHash = async (file: File): Promise<string> => {
  const worker = new FileHashWorker()
  worker.postMessage(file)
  return new Promise(resolve => {
    worker.onmessage = e => {
      resolve(e.data as string)
    }
  })
}

type SliceFileResult = { chunkList: Blob[]; hash: string }

const sliceFile = async (file: File): Promise<SliceFileResult> => {
  const worker = new FileSliceWorker()
  worker.postMessage({ file, chunkSize: CHUNK_SIZE })
  return new Promise(resolve => {
    worker.onmessage = e => {
      resolve(e.data as SliceFileResult)
    }
  })
}

export const uploadFile = async (file: File, path: string) => {
  if (file.size <= CHUNK_SIZE) {
    const hash = await calculateHash(file)
    const existed = await checkFileHash(hash)
    if (!existed) {
      const url = await getUploadUrl(hash)
      await fetch(url, {
        method: 'PUT',
        body: file
      })
    }
    await createFile({
      name: file.name,
      type: file.type,
      path,
      hash,
      suffix: mime.getExtension(file.type)
    })
  } else {
    const { chunkList, hash } = await sliceFile(file)
    /**
     * 根据文件hash判断文件是秒传还是续传还是完整上传
     */

    // 完整上传
    const uploadList = chunkList.map(async (chunk, index) => {
      const hashNo = hash + '/' + index
      return await getChunkUploadUrl(hashNo).then(url => {
        return fetch(url, {
          method: 'PUT',
          body: chunk
        })
      })
    })
    await Promise.all(uploadList)
    await mergeChunks({
      name: file.name,
      type: file.type,
      path,
      hash,
      suffix: mime.getExtension(file.type)
    })
  }
}
