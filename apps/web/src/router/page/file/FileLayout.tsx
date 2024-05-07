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
import { ChangeEventHandler, useRef, useState } from 'react'
import { createFolder } from '@/lib/api/file'
import { useFiles } from '@/hooks/swr/file'
import { uploadFile } from '@/lib/file'

export default function FileLayout() {
  const { pathname } = useLocation()
  const path = decodeURIComponent(pathname)
  const folders = path.slice(1).split('/')
  const { mutate } = useFiles(path)
  return (
    <div className="w-page flex flex-col">
      <header className="h-header flex items-center justify-between p-2">
        <div className="text-lg">{folders.at(-1)}</div>
        <div>
          <CreateFolder mutate={mutate} />
          <UploadFile path={path} />
        </div>
      </header>
      <ScrollArea className="flex-1">
        <Outlet />
      </ScrollArea>
    </div>
  )
}

function UploadFile({ path }: { path: string }) {
  const uploadRef = useRef<HTMLInputElement>(null)
  const onUpload: ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files![0]
    await uploadFile(file, path)
    e.target.value = ''
  }
  return (
    <>
      <Button onClick={() => uploadRef.current?.click()}>
        <FolderUp size="16" className="mr-2" />
        上传文件
        <input type="file" className="hidden" />
      </Button>
      <input
        ref={uploadRef}
        type="file"
        onChange={onUpload}
        className="hidden"
      />
    </>
  )
}

function CreateFolder({ mutate }: { mutate: () => void }) {
  const { pathname } = useLocation()
  const [name, setName] = useState('')
  const onCreateFolder = () => {
    if (!name) return
    const path = decodeURIComponent(pathname)
    createFolder(name, path).then(() => {
      mutate()
      setOpen(false)
    })
  }
  const [open, setOpen] = useState(false)
  return (
    <Dialog onOpenChange={setOpen} open={open}>
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
