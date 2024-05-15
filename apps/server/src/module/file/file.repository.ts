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

export type FolderTree = {
  id: string
  name: string
  children: FolderTree[]
}

@Injectable()
export class FileRepository {
  @Inject()
  private prisma: PrismaService

  async findFileById(userId: string, fileId: string) {
    return this.prisma.file.findUnique({
      where: { id: fileId, userId, isFolder: false }
    })
  }

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

  async getFileAncestors(
    fileId: string,
    ancestors: { id: string; name: string }[] = []
  ): Promise<{ id: string; name: string }[]> {
    const file = await this.prisma.file.findUnique({
      where: { id: fileId },
      include: {
        parent: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })
    if (!file || !file.parent) {
      return ancestors
    }
    ancestors.unshift(file.parent)
    return this.getFileAncestors(file.parent.id, ancestors)
  }

  async findByKeyword(userId: string, keyword: string) {
    const files = await this.prisma.file.findMany({
      where: {
        userId,
        name: {
          contains: keyword
        },
        isFolder: false
      },
      select: {
        ...FILE_SELECT
      }
    })
    const result: {
      id: string
      name: string
      size: number | null
      type: string | null
      suffix: string | null
      userId: string
      uploadTime: Date
      folderStack: { id: string; name: string }[]
    }[] = []
    for (const file of files) {
      const folderStack = await this.getFileAncestors(file.id)
      result.push({
        ...file,
        folderStack
      })
    }
    return result
  }

  async findFolderTree(folderId: string): Promise<FolderTree> {
    const folder = await this.prisma.file.findUnique({
      where: { id: folderId, isFolder: true },
      include: {
        children: {
          where: { isFolder: true }
        }
      }
    })

    if (!folder) {
      throw new Error('未找到文件夹')
    }

    const children = await Promise.all(
      folder.children.map(async (child) => await this.findFolderTree(child.id))
    )

    return {
      id: folder.id,
      name: folder.name,
      children
    }
  }

  async getFolderTree(userId: string) {
    const rootFolders = await this.prisma.file.findMany({
      where: {
        userId,
        parentId: null,
        isFolder: true
      }
    })
    const folderTree = await Promise.all(
      rootFolders.map(async (folder) => {
        return await this.findFolderTree(folder.id)
      })
    )
    return folderTree
  }

  async remove(userId: string, fileId: string, targetId?: string) {
    if (targetId) {
      const folder = await this.prisma.file.findUnique({
        where: { id: targetId, isFolder: true }
      })
      if (!folder) {
        throw new Error('目标文件夹不存在')
      }
    }
    return this.prisma.file.update({
      where: { id: fileId, userId },
      data: {
        parentId: targetId ? targetId : null
      }
    })
  }
}
