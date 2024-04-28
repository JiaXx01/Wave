import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useEffect } from 'react'
import { useMe } from '@/hooks/swr/user'
import InitName from './InitName'
import { useNotes } from '@/hooks/swr/note'

export default function Layout() {
  const navigate = useNavigate()
  useEffect(() => {
    const refreshToken = window.localStorage.getItem('refreshToken')
    if (!refreshToken) navigate('/login', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { user, isLoading } = useMe()
  useNotes()
  if (isLoading) return null
  if (!user?.name) return <InitName />
  return (
    <div className="h-screen w-screen flex">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
