import { IsNotEmpty, MaxLength } from 'class-validator'

export class UpdateTitleDto {
  @IsNotEmpty({
    message: '笔记标题不能为空'
  })
  @MaxLength(15, {
    message: '笔记标题不能超过15个字符'
  })
  title: string
}

export class UpdateContentDto {
  @IsNotEmpty({
    message: '笔记内容不能为空'
  })
  content: any
}
