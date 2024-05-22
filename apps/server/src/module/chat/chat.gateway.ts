import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets'
import { ChatService } from './chat.service'
import { CreateChatDto } from './dto/create-chat.dto'
import { UpdateChatDto } from './dto/update-chat.dto'
import type { Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { Inject } from '@nestjs/common'
import { TokenPayload } from 'src/type'
import { RedisService } from 'src/redis/redis.service'

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
      await this.redis.delTokenId(userId)
    }
  }

  @SubscribeMessage('createChat')
  create(@MessageBody() createChatDto: CreateChatDto) {
    console.log('jjjj')
    return this.chatService.create(createChatDto)
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll()
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id)
  }

  @SubscribeMessage('updateChat')
  update(@MessageBody() updateChatDto: UpdateChatDto) {
    return this.chatService.update(updateChatDto.id, updateChatDto)
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id)
  }
}
