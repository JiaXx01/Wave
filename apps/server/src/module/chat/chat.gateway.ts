import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket
} from '@nestjs/websockets'
import { ChatService } from './chat.service'
import type { Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { Inject } from '@nestjs/common'
import { TokenPayload } from 'src/type'
import { RedisService } from 'src/redis/redis.service'
import { UserId } from 'src/custom.decorator'

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    allowedHeaders: ['*'],
    credentials: true
  }
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly chatService: ChatService) {}

  @Inject()
  private jwt: JwtService

  @Inject()
  private redis: RedisService

  async handleConnection(client: Socket) {
    const socketId = client.id
    const accessToken = client.handshake.auth.token
    if (!accessToken) return client.disconnect()
    try {
      const { userId } = this.jwt.verify<TokenPayload>(accessToken)
      client.handshake.query.userId = userId
      await this.redis.setSocketId(userId, socketId)
    } catch (err) {
      client.disconnect()
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId
    if (typeof userId === 'string') {
      await this.redis.delSocketId(userId)
    }
  }

  @SubscribeMessage('findPendingMessage')
  async findPendingMessage(@UserId() userId: string) {
    console.log('pending', userId)
    return await this.chatService.findPendingMessage(userId)
  }

  @SubscribeMessage('sendFriendRequest')
  async sendFriendRequest(
    @UserId() userId: string,
    @MessageBody() id: string,
    @ConnectedSocket() socket: Socket
  ) {
    const target = await this.redis.getSocketId(id)
    const sender = await this.chatService.sendFriendRequest(userId, id)
    if (target) {
      socket.to(target).emit('receiveFriendRequest', sender)
    }
    return {
      success: true,
      data: '好友请求发送成功'
    }
  }

  @SubscribeMessage('handleFriendRequest')
  async handleFriendRequest(
    @UserId() userId: string,
    @MessageBody() { id, isAccept }: { id: string; isAccept: boolean },
    @ConnectedSocket() socket: Socket
  ) {
    console.log(userId, id, isAccept)
    const { sender, receiver } = await this.chatService.handleFriendRequest(
      userId,
      id,
      isAccept
    )
    const target = await this.redis.getSocketId(sender.id)
    if (target) {
      socket.to(target).emit('friendRequestProcessed', {
        receiver,
        isAccept
      })
    }
    return {
      success: true,
      data: '好友请求已处理'
    }
  }
}
