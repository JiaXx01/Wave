import { Value } from '@udecode/plate-common'

export type NoteInfo = {
  id: string
  title: string
  userId: string
  updateTime: string
  createTime: string
}

export type Note = {
  content: Value | null
} & NoteInfo

export type FilterField = 'title' | 'createTime' | 'updateTime' | 'shared'

export type Filter = {
  key?: string
  title?: string
  createTime?: {
    before: boolean
    time: Date
  }
  updateTime?: {
    before: boolean
    time: Date
  }
  shared?: boolean
}

export type Condition = {
  title?: string
  createTime?: {
    after?: Date
    before?: Date
  }
  updateTime?: {
    after?: Date
    before?: Date
  }
  shared?: boolean
}
