import { ReactElement } from 'react'
import { ToggleTheme } from '@/components/Theme/ToggleTheme'
import { buttonVariants, Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'
import { FileText, MessagesSquare } from 'lucide-react'
import { useMe } from '@/hooks/swr/user'
import UserAvatar from '@/components/UserAvatar'
import { logout } from '@/lib/api/auth'

export default function Sidebar() {
  return (
    <div className="h-screen w-sidebar border-r p-2 flex flex-col gap-2">
      <div className="flex justify-between gap-2">
        <div className="flex-1">
          <UserMenu />
        </div>
        <div>
          <ToggleTheme />
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        <SidebarLink
          to="/note"
          label="笔记"
          icon={<FileText className="h-4 w-4" />}
        />
        <SidebarLink
          to="/chat"
          label="聊天"
          icon={<MessagesSquare className="h-4 w-4" />}
        />
      </nav>
    </div>
  )
}

type SidebarLinkProps = {
  to: string
  label: string
  icon: ReactElement
}

function SidebarLink({ to, label, icon }: SidebarLinkProps) {
  const { pathname } = useLocation()
  const isActive = pathname.startsWith(to)
  const linkClasses = cn(
    'w-full px-2',
    buttonVariants({
      variant: isActive ? 'default' : 'ghost'
    })
  )
  return (
    <Link to={to} className={linkClasses}>
      <div className="w-full flex items-center gap-3">
        <span>{icon}</span>
        <span className="leading-4">{label}</span>
      </div>
    </Link>
  )
}

export function UserMenu() {
  const { user } = useMe()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full p-0">
          <div className="w-full h-full flex items-center px-1 gap-2">
            <UserAvatar
              src={user?.headPic}
              name={user?.name}
              className="h-8 w-8"
            />
            <div className="w-[115px] overflow-hidden text-ellipsis text-left">
              {user?.name}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>退出登录</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
