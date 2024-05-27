import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserRoundPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { OtherUser } from '@/type'
import { findOtherUser } from '@/lib/api/user'

export default function FriendList() {
  return (
    <div className="w-full h-full">
      <div className="flex gap-2 p-2">
        <Input className="flex-1" placeholder="搜索好友" />
        <AddFriend />
      </div>
    </div>
  )
}

function AddFriend() {
  const [email, setEmail] = useState<string>('')
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<OtherUser>()
  useEffect(() => {
    if (!open) {
      setEmail('')
      setUser(undefined)
    }
  }, [open])
  const onSearchUser = () => {
    console.log(email)
    if (!email) return
    findOtherUser({ email }).then(user => {
      setUser(user)
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <UserRoundPlus size="16" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加用户</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="输入用户邮箱"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button size="icon" onClick={onSearchUser}>
            <Search size="16" />
          </Button>
        </div>
        <div>{user && <div></div>}</div>
      </DialogContent>
    </Dialog>
  )
}
