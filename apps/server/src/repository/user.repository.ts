import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { FindUserQuery } from 'src/type'
import { SELECT_USER } from './tool'

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: SELECT_USER
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: SELECT_USER
    })
  }

  async findByName(name: string) {
    return this.prisma.user.findUnique({
      where: { name },
      select: SELECT_USER
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

  async findOtherUserAndFriendship(userId: string, otherUser: FindUserQuery) {
    const user = await this.prisma.user.findUnique({
      where: otherUser,
      include: {
        friendships1: { where: { user2_id: userId } },
        friendships2: { where: { user1_id: userId } },
        friendRequestsSent: { where: { receiverId: userId } },
        friendRequestsReceived: { where: { senderId: userId } }
      }
    })
    if (!user) return null
    const isFriend =
      user.friendships1.length > 0 || user.friendships2.length > 0
    const isFriendRequestPending =
      (user.friendRequestsSent.length > 0 &&
        user.friendRequestsSent[0].status === 'pending') ||
      (user.friendRequestsReceived.length > 0 &&
        user.friendRequestsReceived[0].status === 'pending')
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      headPic: user.headPic,
      isFriend,
      isFriendRequestPending
    }
  }
}
