import { Inject, Injectable } from '@nestjs/common'
import { FileRepository } from './file.repository'

@Injectable()
export class FileService {
  @Inject()
  private file: FileRepository

  async createFolder(userId: string, name: string, path?: string) {
    return this.file.createFolder(userId, name, path)
  }
}
