import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FolderPlus, FolderUp } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { createFolder } from '@/lib/api/file'

export default function FileLayout() {
  const { pathname } = useLocation()
  const folders = decodeURIComponent(pathname.slice(1)).split('/')
  return (
    <div className="w-page flex flex-col">
      <header className="h-header flex items-center justify-between p-2">
        <div className="text-lg">{folders.at(-1)}</div>
        <div>
          <CreateFolder />
          <Button>
            <FolderUp size="16" className="mr-2" />
            上传文件
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1">
        <Outlet />
      </ScrollArea>
    </div>
  )
}

function CreateFolder() {
  const { pathname } = useLocation()
  const [name, setName] = useState('')
  const onCreateFolder = () => {
    if (!name) return
    const path = decodeURIComponent(pathname)
    createFolder(name, path).then(res => {
      console.log(res)
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-2">
          <FolderPlus size="16" className="mr-2" />
          新建文件夹
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>新建文件夹</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              文件夹名称
            </Label>
            <Input
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onCreateFolder}>新建</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
