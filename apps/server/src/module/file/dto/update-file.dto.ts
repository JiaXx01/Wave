export class RenameFileDto {
  name: string
}

export class DeleteFilesDto {
  ids: string[]
}

export class RemoveFileDto {
  targetId?: string
}
