import { IsNotEmpty, Length } from 'class-validator'

export class InitNameDto {
  @IsNotEmpty({
    message: '名称不能为空'
  })
  @Length(3, 10, {
    message: '名称在3～10个字符之间'
  })
  name: string
}
