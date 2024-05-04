import { findFiles } from '@/lib/api/file'
import useSWR from 'swr'

export const useFiles = (path: string) => {
  const { data, isLoading, mutate } = useSWR(['/file', path], ([, path]) =>
    findFiles(path)
  )
  return { data, isLoading, mutate }
}
