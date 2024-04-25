import { IsNotEmpty } from 'class-validator'

export class LogoutDto {
  @IsNotEmpty({
    message: 'refreshToken不能为空'
  })
  refreshToken: string

  accessToken?: string
}
