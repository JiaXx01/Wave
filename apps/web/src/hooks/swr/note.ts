import { getNotes } from '@/lib/api/note'
import useSWR from 'swr'

export const useNotes = () => {
  const { data: notes, isLoading } = useSWR('/note', getNotes)
  return { notes, isLoading }
}
