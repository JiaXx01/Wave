import { Inject, Injectable } from '@nestjs/common'

import { UserRepository } from '../../repository/user.repository'
import { FriendshipRepository } from '../../repository/friendship.repository'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class ChatService {
  @Inject()
  private user: UserRepository

  @Inject()
  private friend: FriendshipRepository

  async sendFriendRequest(senderId: string, receiverId: string) {
    const friendship = await this.friend.findFriendship(senderId, receiverId)
    const friendRequest = await this.friend.findFriendRequestLog(
      senderId,
      receiverId
    )
    if (friendship || friendRequest) {
      throw new WsException('请勿重复添加好友')
    }
    await this.friend.createFriendship(senderId, receiverId)
    const sender = await this.user.findById(senderId)
    return sender
  }

  async findPendingMessage(userId: string) {
    const friendRequestList = await this.friend.findFriendRequestPending(userId)
    return {
      friendRequestList
    }
  }

  async handleFriendRequest(
    userId: string,
    requestId: string,
    isAccept: boolean
  ) {
    const { sender, receiver } = await this.friend.changeRequestPending(
      userId,
      requestId,
      isAccept
    )
    await this.friend.addFriend(userId, sender.id)
    return { sender, receiver }
  }
}
