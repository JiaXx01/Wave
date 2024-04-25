import { NoteInfo } from '@/type'
import http from './http'

export const createNote = async (): Promise<NoteInfo> => {
  return http.post('/note').then(res => res.data)
}

export const getNotes = async (): Promise<NoteInfo[]> => {
  return http.get('/note').then(res => res.data)
}
