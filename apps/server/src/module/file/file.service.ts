import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { FileRepository } from './file.repository'
import {
  Client as MinioClient,
  CopySourceOptions,
  CopyDestinationOptions
} from 'minio'
import { CreateFileDto } from './dto/create-file.dto'

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

  async mergeChunks(userId: string, fileInfo: CreateFileDto) {
    const hash = fileInfo.hash
    // 获取所有切片名称
    const chunkHashNoList: string[] = await new Promise((resolve) => {
      const list: string[] = []
      const stream = this.minio.listObjects('chunk', hash, true)
      stream.on('data', (obj) => list.push(obj.name as string))
      stream.on('end', () => {
        resolve(list)
      })
    })
    // 合并切片
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
    // 删除切片
    await this.minio.removeObjects('chunk', chunkHashNoList)
    // 文件信息写入数据库
    return await this.file.createFile(userId, fileInfo)
  }

  async createFile(userId: string, fileInfo: CreateFileDto) {
    return await this.file.createFile(userId, fileInfo)
  }

  async createFolder(userId: string, name: string, path?: string) {
    return this.file.createFolder(userId, name, path)
  }

  async findFiles(userId: string, path: string, skip?: number, take?: number) {
    if (path !== '/file') {
      const paths = path.split('/')
      const folder = await this.file.findFolderByPath(
        userId,
        paths.slice(0, -1).join('/'),
        path.at(-1) as string
      )
      console.log(folder)
      if (!folder) {
        throw new HttpException('文件夹不存在', HttpStatus.NOT_FOUND)
      }
    }
    const folders = await this.file.findFolders(userId, path, skip, take)
    const files = await this.file.findFiles(userId, path, skip, take)
    return { folders, files }
  }

  async checkHash(hash: string) {
    try {
      await this.minio.statObject('file', hash)
      return true
    } catch (err) {
      const chunkHashNoList = await this.getUploadedChunkHashNo(hash)
      if (chunkHashNoList.length === 0) return false
      else return chunkHashNoList
    }
  }

  private async getUploadedChunkHashNo(hash: string): Promise<string[]> {
    return new Promise((resolve) => {
      const list: string[] = []
      const stream = this.minio.listObjects('chunk', hash, true)
      stream.on('data', (obj) => list.push(obj.name as string))
      stream.on('end', () => {
        resolve(list)
      })
    })
  }
}
