import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'
import { Socket } from 'socket.io'

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  if (request.userId) return request.userId
  const client = ctx.switchToWs().getClient<Socket>()
  if (client.handshake.query.userId) return client.handshake.query.userId
})
