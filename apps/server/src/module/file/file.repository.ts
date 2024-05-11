import { Inject, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'

const FOLDER_SELECT = {
  id: true,
  name: true,
  userId: true,
  uploadTime: true
}

const FILE_SELECT = {
  ...FOLDER_SELECT,
  size: true,
  type: true,
  suffix: true
}

@Injectable()
export class FileRepository {
  @Inject()
  private prisma: PrismaService

  async createFolder(userId: string, name: string, parentId?: string) {
    return this.prisma.file.create({
      data: { userId, name, isFolder: true, parentId },
      select: FOLDER_SELECT
    })
  }

  async createFile(
    userId: string,
    fileInfo: {
      name: string
      parentId?: string
      type?: string
      suffix?: string
      hash: string
      size: number
    }
  ) {
    return this.prisma.file.create({
      data: { userId, ...fileInfo, isFolder: false }
    })
  }

  async findFolders(
    userId: string,
    folderId?: string,
    skip?: number,
    take?: number
  ) {
    if (folderId) {
      return (
        await this.prisma.file.findUniqueOrThrow({
          where: {
            id: folderId,
            userId,
            isFolder: true
          },
          select: {
            children: {
              where: { isFolder: true },
              select: FOLDER_SELECT,
              skip: skip ? skip : undefined,
              take: take ? take : undefined
            }
          }
        })
      )?.children
    } else {
      return this.prisma.file.findMany({
        where: { userId, parentId: null, isFolder: true },
        select: FOLDER_SELECT,
        skip: skip ? skip : undefined,
        take: take ? take : undefined
      })
    }
  }

  async findFiles(
    userId: string,
    folderId?: string,
    skip?: number,
    take?: number
  ) {
    if (folderId) {
      return (
        await this.prisma.file.findUniqueOrThrow({
          where: { id: folderId, userId, isFolder: true },
          select: {
            children: {
              where: { isFolder: false },
              select: FILE_SELECT,
              skip: skip ? skip : undefined,
              take: take ? take : undefined
            }
          }
        })
      )?.children
    } else {
      return this.prisma.file.findMany({
        where: {
          userId,
          isFolder: false,
          parentId: null
        },
        select: FILE_SELECT,
        skip: skip ? skip : undefined,
        take: take ? take : undefined
      })
    }
  }

  async deleteFiles(userId: string, fileIds: string[]) {
    return this.prisma.file.deleteMany({
      where: {
        userId,
        id: {
          in: fileIds
        },
        isFolder: false
      }
    })
  }

  private async deleteFolderAndChildren(userId: string, folderId: string) {
    await this.prisma.file.findUniqueOrThrow({
      where: {
        id: folderId,
        userId: userId
      }
    })

    const files = await this.prisma.file.findMany({
      where: {
        parentId: folderId,
        isFolder: false
      }
    })
    await this.prisma.file.deleteMany({
      where: {
        id: {
          in: files.map((file) => file.id)
        }
      }
    })

    const folders = await this.prisma.file.findMany({
      where: { parentId: folderId }
    })

    for (const folder of folders) {
      await this.deleteFolderAndChildren(userId, folder.id)
    }
    await this.prisma.file.delete({ where: { id: folderId } })
  }

  async deleteFolders(userId: string, folderIds: string[]) {
    for (const folderId of folderIds) {
      await this.deleteFolderAndChildren(userId, folderId)
    }
  }

  async rename(userId: string, fileId: string, name: string) {
    return this.prisma.file.update({
      where: {
        id: fileId,
        userId
      },
      data: {
        name
      }
    })
  }
}
