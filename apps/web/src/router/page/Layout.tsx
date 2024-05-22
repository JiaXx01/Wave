import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useEffect } from 'react'
import { useMe } from '@/hooks/swr/user'
import InitName from './InitName'
import { useKeepOutlet } from '../KeepAlive'
import ChatContext from './chat/ChatContext'

export default function Layout() {
  const navigate = useNavigate()
  useEffect(() => {
    const refreshToken = window.localStorage.getItem('refreshToken')
    if (!refreshToken) navigate('/login', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const element = useKeepOutlet()
  const { user, isLoading } = useMe()
  if (isLoading) return null
  if (!user?.name) return <InitName />
  return (
    <ChatContext>
      <div className="h-screen w-screen flex">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex-1">
          {/* <Outlet /> */}
          {element}
        </div>
      </div>
    </ChatContext>
  )
}
