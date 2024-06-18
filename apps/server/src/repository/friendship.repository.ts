import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SELECT_USER } from './tool'

@Injectable()
export class FriendshipRepository {
  constructor(private prisma: PrismaService) {}

  async createFriendship(senderId: string, receiverId: string) {
    return this.prisma.friendRequest.create({
      data: { senderId, receiverId }
    })
  }

  async findFriendRequestLog(user1_id: string, user2_id: string) {
    return this.prisma.friendRequest.findFirst({
      where: {
        OR: [
          { senderId: user1_id, receiverId: user2_id },
          { senderId: user2_id, receiverId: user1_id }
        ]
      }
    })
  }

  async findFriendship(user1_id: string, user2_id: string) {
    return this.prisma.friendship.findFirst({
      where: {
        OR: [
          { user1_id: user1_id, user2_id: user2_id },
          { user1_id: user2_id, user2_id: user1_id }
        ]
      }
    })
  }

  async findFriendRequestPending(userId: string) {
    return this.prisma.friendRequest.findMany({
      where: { receiverId: userId, status: 'pending' },
      select: {
        id: true,
        sender: {
          select: SELECT_USER
        },
        createTime: true
      }
    })
  }

  async changeRequestPending(
    userId: string,
    requestId: string,
    isAccept: boolean
  ) {
    return this.prisma.friendRequest.update({
      where: {
        id: requestId,
        receiverId: userId
      },
      data: {
        status: isAccept ? 'accepted' : 'rejected'
      },
      select: {
        sender: {
          select: SELECT_USER
        },
        receiver: {
          select: SELECT_USER
        }
      }
    })
  }

  async addFriend(user1_id: string, user2_id: string) {
    return this.prisma.friendship.create({
      data: {
        user1_id,
        user2_id
      }
    })
  }

  async findFriendList(userId: string) {
    const { friendships1, friendships2 } =
      await this.prisma.user.findUniqueOrThrow({
        where: { id: userId },
        select: {
          friendships1: { select: { user2: { select: SELECT_USER } } },
          friendships2: { select: { user1: { select: SELECT_USER } } }
        }
      })

    return [
      ...friendships1.map((friendships) => friendships.user2),
      ...friendships2.map((friendship) => friendship.user1)
    ]
  }
}
