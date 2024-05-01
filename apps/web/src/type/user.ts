export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type User = {
  id: string
  name?: string | null
  email: string
  headPic?: string | null
  createTime: string
  updateTime: string
}
