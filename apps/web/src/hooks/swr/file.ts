import { findFiles } from '@/lib/api/file'
import useSWR from 'swr'

export const useFiles = (folderId?: string) => {
  const {
    data: files,
    isLoading,
    mutate
  } = useSWR(['/file', folderId], ([, folderId]) => findFiles(folderId))
  return { files, isLoading, mutate }
}
