import { NoteInfo } from '@/type'
import http from './http'

export const createNote = async (): Promise<NoteInfo> => {
  return http.post('/note').then(res => res.data)
}

export const getNotes = async (): Promise<NoteInfo[]> => {
  return http.get('/note').then(res => res.data)
}

export const deleteNotes = async (ids: string[]) => {
  return http
    .delete('/note', {
      params: {
        ids: JSON.stringify(ids)
      }
    })
    .then(res => res.data)
}

export const findNote = async (id: string) => {
  return http.get(`/note/${id}`).then(res => res.data)
}
