import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserRepository } from 'src/repository/user.repository'
import { GithubStrategy } from './github.strategy'
import { GoogleStrategy } from './google.strategy'

@Module({
  providers: [AuthService, UserRepository, GithubStrategy, GoogleStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
