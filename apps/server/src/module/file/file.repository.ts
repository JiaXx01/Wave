import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

const FOLDER_SELECT = {
  id: true,
  name: true,
  path: true,
  userId: true,
  uploadTime: true
}

const FILE_SELECT = {
  ...FOLDER_SELECT,
  url: true,
  size: true,
  type: true,
  suffix: true
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

  async findFolders(
    userId: string,
    path: string = '/file',
    skip?: number,
    take?: number
  ) {
    console.log(userId, path)
    return this.prisma.file.findMany({
      where: { userId, path, isFolder: true },
      select: FOLDER_SELECT
      // skip,
      // take
    })
  }

  async findFiles(
    userId: string,
    path: string = '/file',
    skip?: number,
    take?: number
  ) {
    return this.prisma.file.findMany({
      where: { userId, path, isFolder: false },
      select: FILE_SELECT
      // skip,
      // take
    })
  }
}
