import { Module } from '@nestjs/common'
import { ChatService } from './chat.service'
import { ChatGateway } from './chat.gateway'
import { UserRepository } from '../../repository/user.repository'
import { FriendshipRepository } from '../../repository/friendship.repository'

@Module({
  providers: [ChatGateway, ChatService, UserRepository, FriendshipRepository]
})
export class ChatModule {}
