import { Condition, Filter, NoteInfo } from '@/type'
import dayjs from 'dayjs'

export const calculateNotesFilterCondition = (
  filterList: Filter[]
): Condition => {
  const condition: Condition = {}
  filterList.forEach(filter => {
    if (filter.title) {
      condition.title = filter.title
      return
    }

    if (filter.createTime) {
      const { before, time } = filter.createTime
      const then = before ? 'before' : 'after'
      if (condition.createTime) {
        if (condition.createTime[then]) {
          const preTime = condition.createTime[then]
          if (before) {
            if (dayjs(time).isBefore(preTime)) condition.createTime[then] = time
          } else {
            if (dayjs(time).isAfter(preTime)) condition.createTime[then] = time
          }
        } else condition.createTime[then] = time
      } else {
        condition.createTime = {
          [then]: time
        }
      }
      return
    }

    if (filter.updateTime) {
      const { before, time } = filter.updateTime
      const then = before ? 'before' : 'after'
      if (condition.updateTime) {
        if (condition.updateTime[then]) {
          const preTime = condition.updateTime[then]
          if (before) {
            if (dayjs(time).isBefore(preTime)) condition.updateTime[then] = time
          } else {
            if (dayjs(time).isAfter(preTime)) condition.updateTime[then] = time
          }
        } else condition.updateTime[then] = time
      } else {
        condition.updateTime = {
          [then]: time
        }
      }
      return
    }

    if (filter.shared !== undefined) {
      condition.shared = filter.shared
      return
    }
  })
  return condition
}

export const filterNotes = (notes: NoteInfo[], condition: Condition) => {
  return notes.filter(note => {
    if (condition.title && !(note.title?.includes(condition.title) || false))
      return false
    if (condition.createTime) {
      const { after, before } = condition.createTime
      if (before && dayjs(before).isBefore(note.createTime)) return false
      if (after && dayjs(after).isAfter(note.createTime)) return false
    }
    if (condition.updateTime) {
      const { after, before } = condition.updateTime
      if (before && dayjs(before).isBefore(note.updateTime)) return false
      if (after && dayjs(after).isAfter(note.updateTime)) return false
    }
    // if (condition.shared !== undefined) return
    return true
  })
}
