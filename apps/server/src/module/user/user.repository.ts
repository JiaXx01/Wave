import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id }
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    })
  }

  async findByName(name: string) {
    return this.prisma.user.findUnique({
      where: { name }
    })
  }

  async setName(id: string, name: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name
      }
    })
  }
}
