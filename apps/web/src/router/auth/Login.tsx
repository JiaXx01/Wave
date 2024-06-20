import { ToggleTheme } from '@/components/Theme/ToggleTheme'
import LoginForm from './LoginForm'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import googlePng from '@/assets/oauth_icon/google.png'
import githubPng from '@/assets/oauth_icon/github.png'
import wechatPng from '@/assets/oauth_icon/wechat.png'
import { useSearch } from '@/hooks/url'
import { setTokens } from '@/lib/token'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export default function Login() {
  const navigate = useNavigate()
  useEffect(() => {
    const refreshToken = window.localStorage.getItem('refreshToken')
    if (refreshToken) navigate('/', { replace: true })
  }, [navigate])
  const search = useSearch()
  useEffect(() => {
    const { accessToken, refreshToken } = search
    if (accessToken && refreshToken) {
      setTokens({ accessToken, refreshToken })
      navigate('/', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onOAuthLogin = (type: 'github' | 'google' | 'wechat') => {
    window.location.href = `${BACKEND_URL}/auth/login/${type}`
  }
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
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex items-center justify-center">
            <span className="text-xs uppercase text-muted-foreground bg-background px-2">
              其他登录方式
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOAuthLogin('wechat')}
          >
            <img src={wechatPng} className="h-4 mr-2" />
            <span className="w-[50px]">微信</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOAuthLogin('github')}
          >
            <img src={githubPng} className="h-4 mr-2" />
            <span className="w-[50px]">Github</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOAuthLogin('google')}
          >
            <img src={googlePng} className="h-4 mr-2" />
            <span className="w-[50px]">Google</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
