import {
  checkFileHash,
  createFile,
  getChunkUploadUrl,
  getDownloadUrl,
  getUploadUrl,
  mergeChunks
} from './api/file'
import FileHashWorker from './worker/fileHash?worker'
import FileSliceWorker from './worker/fileSlice?worker'
import mime from 'mime'

import ExcelIcon from '@/assets/file_icon/excel.png'
import ImageIcon from '@/assets/file_icon/image.png'
import LinkIcon from '@/assets/file_icon/link.png'
import RadioIcon from '@/assets/file_icon/radio.png'
import PdfIcon from '@/assets/file_icon/pdf.png'
import PptIcon from '@/assets/file_icon/ppt.png'
import TxtIcon from '@/assets/file_icon/txt.png'
import UnknownIcon from '@/assets/file_icon/unknown.png'
import VideoIcon from '@/assets/file_icon/video.png'
import WordIcon from '@/assets/file_icon/word.png'
import ZipIcon from '@/assets/file_icon/zip.png'
import axios from 'axios'
import {
  addUploadProgress,
  createUploadProgress,
  removeUploadProgress
} from '@/router/page/file/fileStore'

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

export const uploadFile = async (file: File, parentId?: string) => {
  if (file.size <= CHUNK_SIZE) {
    const hash = await calculateHash(file)
    const uploadedState = await checkFileHash(hash)
    createUploadProgress(hash, {
      fileName: file.name,
      loaded: 0,
      total: file.size
    })
    if (uploadedState !== true) {
      const url = await getUploadUrl(hash)
      await axios.put(url, file, {
        onUploadProgress(e) {
          addUploadProgress(hash, e.bytes)
        }
      })
    }
    await createFile({
      name: file.name,
      type: file.type,
      parentId,
      hash,
      suffix: mime.getExtension(file.type),
      size: file.size
    })
    removeUploadProgress(hash)
  } else {
    const { chunkList, hash } = await sliceFile(file)
    /**
     * 根据文件hash判断文件是秒传还是续传还是完整上传
     */
    const uploadedState = await checkFileHash(hash)
    if (uploadedState !== true) {
      const { list, loaded } = uploadedState
      const chunkHashMap = list.reduce(
        (pre, cur) => {
          pre[cur] = true
          return pre
        },
        {} as Record<string, boolean>
      )
      createUploadProgress(hash, {
        fileName: file.name,
        loaded,
        total: file.size
      })
      const uploadList = chunkList.map(async (chunk, index) => {
        const hashNo = hash + '/' + index
        if (chunkHashMap[hashNo]) return
        return await getChunkUploadUrl(hashNo).then(url => {
          return axios.put(url, chunk, {
            onUploadProgress(e) {
              addUploadProgress(hash, e.bytes)
            }
          })
        })
      })
      await Promise.all(uploadList)
      await mergeChunks({
        name: file.name,
        type: file.type,
        parentId,
        hash,
        suffix: mime.getExtension(file.type),
        size: file.size
      })
    } else {
      await createFile({
        name: file.name,
        type: file.type,
        parentId,
        hash,
        suffix: mime.getExtension(file.type),
        size: file.size
      })
    }
    removeUploadProgress(hash)
  }
}

export const downloadFile = async (id: string) => {
  const { url } = await getDownloadUrl(id)
  const download = document.createElement('a')
  download.href = url
  download.click()
  download.remove()
}

export const FILE_ICON = {
  excel: ExcelIcon,
  image: ImageIcon,
  link: LinkIcon,
  radio: RadioIcon,
  pdf: PdfIcon,
  ppt: PptIcon,
  txt: TxtIcon,
  unknown: UnknownIcon,
  video: VideoIcon,
  word: WordIcon,
  zip: ZipIcon
}

export const getFileIcon = (suffix?: string | null) => {
  if (!suffix) return FILE_ICON.unknown
  // 图片格式
  const imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif']
  // 匹配图片
  if (imgList.includes(suffix)) return FILE_ICON.image
  // 匹配 txt
  if (suffix === 'txt') return FILE_ICON.txt
  // 匹配 excel
  const excelList = ['xls', 'xlsx']
  if (excelList.includes(suffix)) return FILE_ICON.excel
  // 匹配 word
  const wordList = ['doc', 'docx']
  if (wordList.includes(suffix)) return FILE_ICON.word
  // 匹配 pdf
  if (suffix === 'pdf') return FILE_ICON.pdf
  // 匹配 ppt
  const pptList = ['ppt', 'pptx']
  if (pptList.includes(suffix)) return FILE_ICON.ppt
  // 匹配 视频
  const videoList = ['mp4', 'm2v', 'mkv']
  if (videoList.includes(suffix)) return FILE_ICON.video
  // 匹配 音频
  const radioList = ['mp3', 'wav', 'wmv']
  if (radioList.includes(suffix)) return FILE_ICON.radio
  const compressList = ['zip', 'rar', '7z']
  if (compressList.includes(suffix)) return FILE_ICON.zip
  // 其他 文件类型
  return FILE_ICON.unknown
}
