import { findNotes } from '@/lib/api/note'
// import { NoteInfo } from '@/type'
import useSWR from 'swr'

export const useNotes = () => {
  const { data: notes, isLoading } = useSWR('/note', findNotes)
  return { notes, isLoading }
}
