import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { getLoginCode, login } from '@/lib/api/auth'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  email: z.string().email({
    message: '请输入正确的邮箱格式'
  }),
  code: z.string().length(6, '请输入6位验证码')
})

export default function LoginForm() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      code: ''
    }
  })

  const getEmailCode = async () => {
    const validated = await form.trigger('email')
    if (!validated) return
    const email = form.watch('email')
    getLoginCode(email)
  }

  const onSubmit = ({ email, code }: z.infer<typeof formSchema>) => {
    login(email, code).then(({ accessToken, refreshToken }) => {
      window.localStorage.setItem('accessToken', accessToken)
      window.localStorage.setItem('refreshToken', refreshToken)
      navigate('/', { replace: true })
    })
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">邮箱</FormLabel>
                <FormControl>
                  <Input placeholder="邮箱" {...field}></Input>
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">邮箱</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="验证码" {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getEmailCode}
                  >
                    获取验证码
                  </Button>
                </div>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            登录
          </Button>
        </form>
      </Form>
    </div>
  )
}
