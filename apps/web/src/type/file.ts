type FolderField = 'id' | 'name' | 'path' | 'uploadTime' | 'userId'
export type FolderInfo = Record<FolderField, string>

export type FileInfo = {
  type: string
  suffix: string | null
} & FolderInfo

export type CreateFileParams = {
  name: string
  parentId?: string
  type: string
  suffix: string | null
  hash: string
  size: number
}
