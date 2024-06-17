import { useToast } from '@/components/ui/use-toast'
import { socket } from '@/lib/socket'
import { User } from '@/type'
import { HandledFriendRequestRes, PendingMessage } from '@/type/chat'
import { ReactNode, useEffect, useRef } from 'react'
import useChatStore from './chatStore'

export default function ChatContext({ children }: { children: ReactNode }) {
  const initPendingMessage = useChatStore.use.initPendingMessage()
  const { toast } = useToast()
  const connected = useRef(false)
  useEffect(() => {
    if (connected.current) return
    connected.current = true
    socket.connect()
    socket.on('connect', () => {
      socket.emit('findPendingMessage', (pendingMessage: PendingMessage) => {
        initPendingMessage(pendingMessage)
      })
    })

    socket.on('receiveFriendRequest', (user: User) => {
      toast({
        title: '好友请求',
        description: `${user.name} 请求添加好友`
      })
    })

    socket.on(
      'friendRequestProcessed',
      ({ receiver, isAccept }: HandledFriendRequestRes) => {
        console.log(receiver)
        toast({
          description: `${receiver.name}${isAccept ? '接受' : '拒绝'}了你的好友请求`
        })
      }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return children
}
