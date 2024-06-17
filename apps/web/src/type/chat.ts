import { User } from './user'

export type SocketRes = {
  success: boolean
  data: any
}

export type FriendRequest = {
  id: string
  createTime: string
  sender: User
}

export type PendingMessage = {
  friendRequestList: FriendRequest[]
}

export type HandledFriendRequestRes = {
  receiver: User
  isAccept: boolean
}
