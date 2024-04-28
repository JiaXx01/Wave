import { NoteInfo } from '@/type'
import http from './http'
import { Value } from '@udecode/plate-common'

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

export const updateTitle = async (id: string, title: string) => {
  return http.put(`/note/${id}/title`, { title })
}

export const updateContent = async (id: string, content: Value) => {
  return http.put(`/note/${id}`, { content })
}
