import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, UserRoundPlus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { OtherUser, User } from '@/type'
import { findOtherUser } from '@/lib/api/user'
import UserAvatar from '@/components/UserAvatar'
import { socket } from '@/lib/socket'
import { SocketRes } from '@/type/chat'
import { useToast } from '@/components/ui/use-toast'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import useChatStore from './chatStore'
import dayjs from 'dayjs'

import { useFriendList } from '@/hooks/swr/user'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useDebounceEffect } from 'ahooks'

export default function Friend() {
  const [friendSearchKey, setFriendSearchKey] = useState('')
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-2 p-2">
        <Input
          className="flex-1"
          placeholder="搜索好友"
          value={friendSearchKey}
          onChange={e => setFriendSearchKey(e.target.value)}
        />
        <NewFriend />
      </div>
      <ScrollArea className="flex-1 px-2">
        <FriendList searchKey={friendSearchKey} />
      </ScrollArea>
    </div>
  )
}

function FriendList({ searchKey }: { searchKey: string }) {
  const { friendList } = useFriendList()
  const [showFriendList, setShowFriendList] = useState<User[]>([])
  useDebounceEffect(
    () => {
      if (!searchKey || !friendList) {
        setShowFriendList(friendList ? friendList : [])
      } else {
        const showFriendList = friendList.filter(friend =>
          friend.name
            ?.toLocaleLowerCase()
            ?.includes(searchKey.toLocaleLowerCase())
        )
        setShowFriendList(showFriendList)
      }
    },
    [searchKey, friendList],
    { wait: 500 }
  )
  return (
    <div className="flex-1">
      {showFriendList.map(friend => (
        <div
          key={friend.id}
          className="flex items-center gap-2 py-1 px-2 my-1 rounded-md hover:bg-muted"
        >
          <UserAvatar src={friend.headPic} />
          <div>{friend.name}</div>
        </div>
      ))}
    </div>
  )
}

function NewFriend() {
  const friendRequestCount = useChatStore.use.friendRequestList().length
  const [addFriendOpen, setAddFriendOpen] = useState(false)
  const [friendRequestOpen, setFriendREquestOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline" className="relative">
            <UserRoundPlus size="16" />
            {friendRequestCount > 0 && (
              <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center">
                {friendRequestCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[6rem]">
          <DropdownMenuItem onClick={() => setAddFriendOpen(true)}>
            添加好友
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFriendREquestOpen(true)}>
            好友申请 {friendRequestCount > 0 && <span className="ml-2">1</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AddFriend open={addFriendOpen} setOpen={setAddFriendOpen} />
      <FriendRequest open={friendRequestOpen} setOpen={setFriendREquestOpen} />
    </>
  )
}

function AddFriend({
  open,
  setOpen
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const { toast } = useToast()
  const [email, setEmail] = useState<string>('')
  const [user, setUser] = useState<OtherUser | null>(null)
  useEffect(() => {
    if (!open) {
      setEmail('')
      setUser(null)
    }
  }, [open])
  const onSearchUser = () => {
    console.log(email)
    if (!email) return
    findOtherUser({ email }).then(user => {
      setUser(user)
    })
  }
  const onSendRequest = (id: string) => {
    socket.emit('sendFriendRequest', id, (res: SocketRes) => {
      console.log(res)
      if (res.success) {
        setOpen(false)
        toast({
          description: '好友请求已发送'
        })
      }
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加好友</DialogTitle>
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
        <div>
          {user && (
            <div className="flex gap-2 items-center">
              <UserAvatar name={user.name} src={user.headPic} />
              <div>{user.name}</div>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                disabled={user.isFriend || user.isFriendRequestPending}
                onClick={() => onSendRequest(user.id)}
              >
                {user.isFriend
                  ? '好友'
                  : user.isFriendRequestPending
                    ? '待处理'
                    : '添加'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FriendRequest({
  open,
  setOpen
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) {
  const friendRequestList = useChatStore.use.friendRequestList()
  const removeFriendRequest = useChatStore.use.removeFriendRequest()
  const onHandleFriendRequest = (id: string, isAccept: boolean) => {
    socket.emit('handleFriendRequest', { id, isAccept }, (res: SocketRes) => {
      if (res.success) {
        removeFriendRequest(id)
      }
    })
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>好友申请</DialogTitle>
        </DialogHeader>
        <div>
          {friendRequestList.length > 0 ? (
            friendRequestList.map(({ id, sender, createTime }) => {
              return (
                <div className="flex gap-2 items-center" key={id}>
                  <UserAvatar name={sender.name} src={sender.headPic} />
                  <div>
                    <div>{sender.name}</div>
                    <div className="text-xs">{dayjs(createTime).fromNow()}</div>
                  </div>
                  <div className="ml-auto">
                    <Button
                      size="sm"
                      onClick={() => onHandleFriendRequest(id, true)}
                    >
                      同意
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-2"
                      onClick={() => onHandleFriendRequest(id, false)}
                    >
                      拒绝
                    </Button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center text-muted-foreground">
              暂无好友申请
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
