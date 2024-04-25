import { ToggleTheme } from '@/components/Theme/ToggleTheme'
import LoginForm from './LoginForm'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Login() {
  const navigate = useNavigate()
  useEffect(() => {
    const refreshToken = window.localStorage.getItem('refreshToken')
    if (refreshToken) navigate('/', { replace: true })
  }, [navigate])
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute top-2 right-2">
        <ToggleTheme />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-96">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-widest">登录</h1>
          <p className="text-sm text-muted-foreground">
            输入你的邮箱登录或注册
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
