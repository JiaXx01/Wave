import { Inject, Injectable } from '@nestjs/common'
import { FileRepository } from './file.repository'
import { Client as MinioClient } from 'minio'

@Injectable()
export class FileService {
  @Inject()
  private file: FileRepository

  @Inject('MinioModule')
  private minio: MinioClient

  async getUploadUrl(userId: string, name: string, path: string) {
    return this.minio.presignedPutObject('file', name)
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
