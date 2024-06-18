import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRepository } from '../../repository/user.repository'
import { FriendshipRepository } from 'src/repository/friendship.repository'

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, FriendshipRepository]
})
export class UserModule {}
