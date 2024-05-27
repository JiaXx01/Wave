import http from '@/lib/api/http'
import { CurUser } from '@/type'
import useSWR from 'swr'

const getMe = (url: string): Promise<CurUser> =>
  http.get(url).then(res => res.data)
export const useMe = () => {
  const { data: user, isLoading } = useSWR('/user/me', getMe, {
    revalidateOnFocus: false
  })
  return { user, isLoading }
}
