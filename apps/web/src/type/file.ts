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

export type FindKeywordResult = {
  id: string
  name: string
  size: number | null
  type: string | null
  suffix: string | null
  userId: string
  uploadTime: Date
  folderStack: { id: string; name: string }[]
}
