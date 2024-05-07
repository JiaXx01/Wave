import { IsNotEmpty } from 'class-validator'

export class CreateFileDto {
  @IsNotEmpty({
    message: '文件名不能为空'
  })
  name: string

  @IsNotEmpty({
    message: '文件path不能为空'
  })
  path: string

  @IsNotEmpty({
    message: '文件mime-type类型不能为空'
  })
  type: string

  suffix?: string

  @IsNotEmpty({
    message: '文件hash不能为空'
  })
  hash: string
}

export class CreateFolderDto {
  @IsNotEmpty({
    message: '文件夹名称不能为空'
  })
  name: string

  path?: string
}
