import UserAvatar from '@/components/UserAvatar'
import useChatStore from './chatStore'

export default function NotificationList() {
  const friendRequestList = useChatStore.use.friendRequestList()
  return (
    <div>
      {friendRequestList.map(friendRequest => (
        <div key={friendRequest.sender.id}>
          <UserAvatar />
        </div>
      ))}
    </div>
  )
}
