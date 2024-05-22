import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'

import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { RedisService } from 'src/redis/redis.service'
import { TokenPayload } from 'src/type'

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private jwt: JwtService

  @Inject()
  private redis: RedisService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()

    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const { userId, type } = this.jwt.verify<TokenPayload>(token)
      if (type !== 'access' || (await this.redis.checkTokenBlackList(token))) {
        throw new UnauthorizedException()
      }
      request.userId = userId
    } catch (error) {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
