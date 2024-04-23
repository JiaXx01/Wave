import { Controller, Get, Inject, Req } from '@nestjs/common'
import { AppService } from './app.service'
import { RedisService } from './redis/redis.service'
import { Request } from 'express'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject()
  redis: RedisService

  @Get()
  async getHello(@Req() request: Request) {
    const cookies = request.cookies
    console.log(cookies)
    // return this.appService.getHello()
    return { cookies }
  }
}
