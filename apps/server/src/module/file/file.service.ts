import { Inject, Injectable } from '@nestjs/common'
import { FileRepository } from './file.repository'
import {
  Client as MinioClient,
  CopySourceOptions,
  CopyDestinationOptions
} from 'minio'

@Injectable()
export class FileService {
  @Inject()
  private file: FileRepository

  @Inject('MinioModule')
  private minio: MinioClient

  async getFileUploadUrl(userId: string, name: string) {
    return this.minio.presignedPutObject('file', name)
  }

  async getChunkPresignedUrl(hashNo: string) {
    return this.minio.presignedPutObject('chunk', hashNo)
  }

  async mergeChunks(userId: string, hash: string) {
    const chunkHashNoList: string[] = await new Promise((resolve) => {
      const list: string[] = []
      const stream = this.minio.listObjects('chunk', hash, true)
      stream.on('data', (obj) => list.push(obj.name as string))
      stream.on('end', () => {
        resolve(list)
      })
    })
    const sourceList = chunkHashNoList.map((hashNo) => {
      return new CopySourceOptions({
        Bucket: 'chunk',
        Object: hashNo
      })
    })
    await this.minio.composeObject(
      new CopyDestinationOptions({
        Bucket: 'file',
        Object: hash
      }),
      sourceList
    )
    await this.minio.removeObjects('chunk', chunkHashNoList)
  }

  async createFolder(userId: string, name: string, path?: string) {
    return this.file.createFolder(userId, name, path)
  }

  async findFiles(userId: string, path: string, skip?: number, take?: number) {
    const folders = await this.file.findFolders(userId, path, skip, take)
    const files = await this.file.findFiles(userId, path, skip, take)
    return { folders, files }
  }
}
