import { IsNotEmpty } from 'class-validator'

export class CreateFileDto {}

export class CreateFolderDto {
  @IsNotEmpty({
    message: '文件夹名称不能为空'
  })
  name: string

  path?: string
}
