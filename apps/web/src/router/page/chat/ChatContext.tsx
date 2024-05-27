import { socket } from '@/lib/socket'
import { ReactNode, useEffect } from 'react'

export default function ChatContext({ children }: { children: ReactNode }) {
  useEffect(() => {
    socket.connect()
    socket.on('connect', () => {
      console.log('connect')
    })
  }, [])
  return children
}
