import http from '@/lib/api/http'
import { User } from '@/type'
import useSWR from 'swr'

const getMe = (url: string): Promise<User> =>
  http.get(url).then(res => res.data)
export const useMe = () => {
  const { data: user, isLoading } = useSWR('/user/me', getMe, {
    revalidateOnFocus: false
  })
  return { user, isLoading }
}
