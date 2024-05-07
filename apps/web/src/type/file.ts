type FolderField = 'id' | 'name' | 'path' | 'uploadTime' | 'userId'
export type Folder = Record<FolderField, string>

export type CreateFileParams = {
  name: string
  path: string
  type: string
  suffix: string | null
  hash: string
}
