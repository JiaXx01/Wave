import useSWR from 'swr'
import { findFriendList, findMe } from '@/lib/api/user'

export const useMe = () => {
  const { data: user, isLoading } = useSWR('/user/me', findMe, {
    revalidateOnFocus: false
  })
  return { user, isLoading }
}

export const useFriendList = () => {
  const { data: friendList, isLoading } = useSWR('/user/friend', findFriendList)
  return { friendList, isLoading }
}
