import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Menu } from 'lucide-react'
import MessageList from './MessageList'
import FriendList from './Friend'
import NotificationList from './NotificationList'
import useChatStore from './chatStore'

export default function ChatLeftArea() {
  const friendRequestListCount = useChatStore.use.friendRequestList().length
  return (
    <Tabs
      defaultValue="message"
      className="min-w-[300px] h-screen flex flex-col"
    >
      <div className="h-header border-b flex items-center gap-2 px-2">
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu size="18" />
        </Button>
        <div className="text-lg text-nowrap">聊天</div>
        <TabsList className="ml-auto">
          <TabsTrigger value="message">消息</TabsTrigger>
          <TabsTrigger value="friend">
            好友 {friendRequestListCount > 0 && friendRequestListCount}
          </TabsTrigger>
          <TabsTrigger value="notify">通知</TabsTrigger>
        </TabsList>
      </div>
      <div className="w-full h-[calc(100vh-var(--header-height))]">
        <TabsContent value="message" className="h-full m-0">
          <MessageList />
        </TabsContent>
        <TabsContent value="friend" className="h-full m-0">
          <FriendList />
        </TabsContent>
        <TabsContent value="notify" className="h-full m-0">
          <NotificationList />
        </TabsContent>
      </div>
    </Tabs>
  )
}
