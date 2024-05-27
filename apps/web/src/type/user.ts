export type Tokens = {
  accessToken: string
  refreshToken: string
}

export type CurUser = {
  id: string
  name?: string | null
  email: string
  headPic?: string | null
  createTime: string
  updateTime: string
}

export type OtherUser = {
  id: string
  name: string
  headPic?: string | null
  isFriend: boolean
  isFriendRequestPending: boolean
}

export type FindUserParams = {
  id?: string
  name?: string
  email?: string
}
