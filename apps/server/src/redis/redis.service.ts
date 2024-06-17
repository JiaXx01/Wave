import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@nestjs-modules/ioredis'
import { Redis } from 'ioredis'

const LOGIN_CODE = 'LOGIN_CODE_'
const TOKEN_BLACKLIST = 'TOKEN_BLACKLIST_'
const SOCKET_ID = 'SOCKET_ID_'

@Injectable()
export class RedisService {
  @InjectRedis()
  private redis: Redis

  async setLoginCode(email: string, code: string) {
    // await this.redis.set(LOGIN_CODE + email, code)
    // await this.redis.expire(LOGIN_CODE + email, 5 * 60)
    await this.redis.setex(LOGIN_CODE + email, 5 * 60, code)
  }

  async getLoginCode(email: string) {
    return await this.redis.get(LOGIN_CODE + email)
  }

  async delLoginCode(email: string) {
    await this.redis.del(LOGIN_CODE + email)
  }

  async addTokenBlacklist(token: string, expire: number) {
    await this.redis.set(TOKEN_BLACKLIST + token, expire)
    await this.redis.expireat(TOKEN_BLACKLIST + token, expire)
  }

  async checkTokenBlackList(token: string) {
    return (await this.redis.exists(TOKEN_BLACKLIST + token)) === 1
  }

  async setSocketId(userId: string, socketId: string) {
    await this.redis.set(SOCKET_ID + userId, socketId)
  }

  async getSocketId(userId: string) {
    return await this.redis.get(SOCKET_ID + userId)
  }

  async delSocketId(userId: string) {
    await this.redis.del(SOCKET_ID + userId)
  }
}
