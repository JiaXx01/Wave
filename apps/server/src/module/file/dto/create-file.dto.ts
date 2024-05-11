import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreateFileDto {
  @IsNotEmpty({
    message: '文件名不能为空'
  })
  name: string

  parentId?: string

  type?: string

  suffix?: string

  @IsNotEmpty({
    message: '文件hash不能为空'
  })
  hash: string

  @IsNotEmpty({
    message: '文件size不能为空'
  })
  size: number
}

export class CreateFolderDto {
  @IsNotEmpty({
    message: '文件夹名称不能为空'
  })
  @MaxLength(20, {
    message: '文件夹名称不超过20个字符'
  })
  name: string

  parentId?: string
}
