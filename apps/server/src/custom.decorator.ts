import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const UserId = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>()
  return request.userId
})
