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
export class RefreshTokenGuard implements CanActivate {
  @Inject()
  jwt: JwtService
  @Inject()
  redis: RedisService

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    try {
      const { userId, type, exp } = this.jwt.verify<TokenPayload>(token)
      if (type !== 'refresh' || (await this.redis.checkTokenBlackList(token))) {
        throw new UnauthorizedException()
      }
      await this.redis.addTokenBlacklist(token, exp)
      request.userId = userId
    } catch (error) {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromHeader(request: Request) {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Refresh' ? token : undefined
  }
}
