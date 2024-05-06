import { Global, Module } from '@nestjs/common'
import { RedisService } from './redis.service'
import { RedisModule as Redis } from '@nestjs-modules/ioredis'

@Global()
@Module({
  imports: [
    Redis.forRoot({
      type: 'single'
    })
  ],
  providers: [RedisService],
  exports: [RedisService]
})
export class RedisModule {}
