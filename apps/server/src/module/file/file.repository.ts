import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

const FOLDER_SELECT = {
  id: true,
  name: true,
  path: true,
  userId: true,
  uploadTime: true
}

@Injectable()
export class FileRepository {
  @Inject()
  private prisma: PrismaService

  async createFolder(userId: string, name: string, path: string = '/file') {
    return this.prisma.file.create({
      data: { userId, name, isFolder: true, path },
      select: FOLDER_SELECT
    })
  }

  async findFiles(userId: string, path: string = '/file') {
    return this.prisma.file.findMany({
      where: { userId, path }
    })
  }
}
