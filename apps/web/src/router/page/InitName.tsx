import { ToggleTheme } from '@/components/Theme/ToggleTheme'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { initName } from '@/lib/api/user'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  name: z
    .string()
    .min(3, '名称长度至少为3个字符')
    .max(10, '名称长度不能超过10个字符')
    .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, {
      message: '名称只能包含中文、大小写字母、数字和下划线'
    })
})

export default function InitName() {
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })

  const onSubmit = async ({ name }: z.infer<typeof formSchema>) => {
    initName(name)
      .then(() => navigate('/', { replace: true }))
      .catch(() => {})
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="absolute top-2 right-2">
        <ToggleTheme />
      </div>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-96">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-widest">设置名称</h1>
        </div>
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">名称</FormLabel>
                    <FormControl>
                      <Input placeholder="名称" {...field} />
                    </FormControl>
                    <FormMessage className="text-xs text-red-600" />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                设置名称
              </Button>
              <Button type="button" variant="outline" className="w-full">
                退出登录
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
