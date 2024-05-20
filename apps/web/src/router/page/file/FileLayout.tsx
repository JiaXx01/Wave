import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileSearch2, FolderPlus, FolderUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChangeEventHandler, useEffect, useRef, useState } from 'react'
import { createFolder, findKeyword } from '@/lib/api/file'
import { useFiles } from '@/hooks/swr/file'
import { getFileIcon, uploadFile } from '@/lib/file'
import Files from './Files'
import useFileStore from './fileStore'
import { FindKeywordResult, FolderStack } from '@/type'

export default function FileLayout() {
  const folderStack = useFileStore.use.folderStack()
  const curFolder = folderStack.at(-1)
  const { mutate } = useFiles(curFolder?.id)
  return (
    <div className="w-page flex flex-col">
      <header className="h-header flex items-center justify-between gap-2 p-2">
        <div className="text-lg flex-1 overflow-hidden text-ellipsis">
          {curFolder?.name || '我的文件'}
        </div>

        <div className="flex items-center gap-2">
          <SearchFile />
          <CreateFolder mutate={mutate} />
          <UploadFile mutate={mutate} />
        </div>
      </header>
      <ScrollArea className="flex-1">
        <Files />
      </ScrollArea>
    </div>
  )
}

function UploadFile({ mutate }: { mutate: () => void }) {
  const folderStack = useFileStore.use.folderStack()
  const curFolder = folderStack.at(-1)
  const uploadRef = useRef<HTMLInputElement>(null)
  const onUpload: ChangeEventHandler<HTMLInputElement> = async e => {
    const file = e.target.files![0]
    e.target.value = ''
    await uploadFile(file, curFolder?.id)
    mutate()
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
  const folderStack = useFileStore(state => state.folderStack)
  const curFolder = folderStack.at(-1)
  const [name, setName] = useState('')
  const onCreateFolder = () => {
    if (!name) return
    createFolder(name, curFolder?.id).then(() => {
      mutate()
      setOpen(false)
    })
  }
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) setName('')
  }, [open])
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button variant="outline">
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
            <Label htmlFor="folder_name" className="text-right">
              文件夹名称
            </Label>
            <Input
              id="folder_name"
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

function SearchFile() {
  const jumpTo = useFileStore.use.jumpTo()
  const [open, setOpen] = useState(false)
  const [searchWord, setSearchWord] = useState('')
  const [keyword, setKeyword] = useState('')
  const [fileList, setFileList] = useState<FindKeywordResult[]>([])
  const onSearch = () => {
    if (!searchWord) return
    findKeyword(searchWord).then(res => {
      setFileList(res)
      setKeyword(searchWord)
    })
  }

  const onJump = (folderStack: FolderStack) => {
    jumpTo(folderStack)
    setOpen(false)
    setSearchWord('')
    setKeyword('')
    setFileList([])
  }

  const renderFileList = (file: FindKeywordResult) => {
    const fileIcon = getFileIcon(file.suffix)
    const filePath = file.folderStack.reduce((path, folder) => {
      return path + folder.name + '/'
    }, '')
    const keywordStartIndex = file.name.search(keyword)

    const filename = (
      <>
        {file.name.slice(0, keywordStartIndex)}
        {<span className="bg-yellow-200">{keyword}</span>}
        {file.name.slice(keywordStartIndex + keyword.length)}
      </>
    )
    return (
      <div
        key={file.id}
        className="px-2 py-1 font-light hover:bg-accent rounded cursor-pointer flex items-center gap-2"
        onClick={() => onJump(file.folderStack)}
      >
        <img src={fileIcon} className="w-4 h-4" />
        <span>
          {filePath}
          {filename}
        </span>
      </div>
    )
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2">
          <FileSearch2 size="18" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>查找文件</DialogTitle>
          <DialogDescription>输入文件名称，搜索文件</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            value={searchWord}
            onChange={e => setSearchWord(e.target.value)}
          />
          <Button onClick={onSearch}>搜索</Button>
        </div>
        <ScrollArea className="max-h-[320px]">
          {fileList.map(file => {
            return renderFileList(file)
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
