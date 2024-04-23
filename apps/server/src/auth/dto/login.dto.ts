import { IsEmail, IsNotEmpty, Length } from 'class-validator'

export class LoginDto {
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '邮箱格式错误',
    },
  )
  email: string

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @Length(6, 6, {
    message: '验证码长度为6位',
  })
  code: string
}
