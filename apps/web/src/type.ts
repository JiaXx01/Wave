import { Value } from '@udecode/plate-common'

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

export type NoteInfo = {
  id: string
  title: string | null
  userId: string
  updateTime: string
  createTime: string
}

export type Note = {
  content: Value | null
} & NoteInfo
