import { getUploadUrl } from './api/file'
import FileHashWorker from './worker/fileHash?worker'

const FILE_CHUNK_SIZE = 5 * 1024 * 1024

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

export const uploadFile = async (file: File) => {
  if (file.size <= FILE_CHUNK_SIZE) {
    const hash = await calculateHash(file)
    const url = await getUploadUrl(hash)
    fetch(url, {
      method: 'PUT',
      body: file
    })
  } else {
    spliceUpload(file)
  }
}

const spliceUpload = (file: File) => {
  console.log(file)
}
