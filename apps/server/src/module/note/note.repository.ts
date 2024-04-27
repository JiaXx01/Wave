import { Inject, Injectable } from '@nestjs/common'

import { PrismaService } from 'src/prisma/prisma.service'

const NOTE_INFO_SELECT = {
  id: true,
  title: true,
  userId: true,
  createTime: true,
  updateTime: true
}

@Injectable()
export class NoteRepository {
  @Inject()
  private prisma: PrismaService

  async create(userId: string) {
    return this.prisma.note.create({
      data: {
        userId
      },
      select: NOTE_INFO_SELECT
    })
  }

  async findUserNotes(userId: string) {
    return this.prisma.note.findMany({
      where: {
        userId
      },
      select: NOTE_INFO_SELECT
    })
  }

  async delete(userId: string, noteIds: string[]) {
    return this.prisma.note.deleteMany({
      where: {
        userId,
        id: {
          in: noteIds
        }
      }
    })
  }
}
