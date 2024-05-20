import { useFiles } from '@/hooks/swr/file'
import folderPng from '@/assets/file_icon/folder.png'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { FileInfo, FolderInfo } from '@/type'
import { downloadFile, getFileIcon } from '@/lib/file'
import { useNavigate } from 'react-router-dom'
import useAlert from '@/components/alert/useAlert'
import {
  deleteFiles,
  deleteFolders,
  getFolderTree,
  removeFile,
  renameFile
} from '@/lib/api/file'
import useFileStore from './fileStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { Tree, TreeItemData } from '@/components/Tree'

export default function FileList() {
  const navigate = useNavigate()
  const folderStack = useFileStore.use.folderStack()
  const { files, isLoading, mutate } = useFiles(folderStack.at(-1)?.id)
  if (isLoading || !files) return null
  if (!files) navigate('/file', { replace: true })
  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-6 lg:grid-cols-9 gap-3 p-2 place-self-center">
        {files.folders.map(folder => (
          <FolderItem key={folder.id} folder={folder} mutate={mutate} />
        ))}

        {files.files.map(file => (
          <FileItem key={file.id} file={file} mutate={mutate} />
        ))}
      </div>
      <RenameDialog mutate={mutate} />
      <RemoveDialog mutate={mutate} />
    </>
  )
}

function FolderItem({
  folder,
  mutate
}: {
  folder: FolderInfo
  mutate: () => void
}) {
  const goto = useFileStore.use.goto()
  const alert = useAlert()
  const openOperation = useFileStore.use.openOperation()
  const onRename = () => {
    openOperation('rename', {
      id: folder.id,
      name: folder.name,
      isFolder: true
    })
  }
  const onRemove = () => {
    openOperation('remove', {
      id: folder.id,
      name: folder.name,
      isFolder: true
    })
  }
  return (
    <div className="place-self-center">
      <ContextMenu key={folder.id}>
        <ContextMenuTrigger>
          <div
            key={folder.id}
            className="w-[90px] flex flex-col items-center cursor-pointer"
            onClick={() => goto(folder.id, folder.name)}
          >
            <div className="h-[75px] w-[75px]">
              <img src={folderPng} />
            </div>
            <div className="mt-1 h-8 w-full text-xs text-center line-clamp-2 break-words px-1">
              {folder.name}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onRename}>重命名</ContextMenuItem>
          <ContextMenuItem onClick={onRemove}>移动到</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={() =>
              alert({
                title: '删除',
                description: `确认删除文件夹 "${folder.name}" 及其子项？`,
                onConfirm() {
                  deleteFolders([folder.id]).then(() => mutate())
                },
                warning: true
              })
            }
          >
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

function FileItem({ file, mutate }: { file: FileInfo; mutate: () => void }) {
  const fileIcon = getFileIcon(file.suffix)
  const alert = useAlert()
  const openOperation = useFileStore.use.openOperation()
  const onRename = () => {
    openOperation('rename', {
      id: file.id,
      name: file.name,
      isFolder: false
    })
  }
  const onRemove = () => {
    openOperation('remove', {
      id: file.id,
      name: file.name,
      isFolder: false
    })
  }
  const onDownload = () => downloadFile(file.id)
  const onCopyUrl = () => {}
  return (
    <div className="place-self-center">
      <ContextMenu key={file.id}>
        <ContextMenuTrigger>
          <div
            key={file.id}
            className="w-[90px] flex flex-col items-center cursor-pointer"
          >
            <div className="h-[75px] w-[75px] flex items-center justify-center">
              <img src={fileIcon} className="h-[65px]" />
            </div>
            <div className="mt-1 h-8 w-full text-xs text-center line-clamp-2 break-words px-1">
              {file.name}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onRename}>重命名</ContextMenuItem>
          <ContextMenuItem onClick={onRemove}>移动到</ContextMenuItem>
          <ContextMenuItem onClick={onDownload}>下载</ContextMenuItem>
          {file.type.includes('image') && (
            <ContextMenuItem onClick={onCopyUrl}>复制url</ContextMenuItem>
          )}
          <ContextMenuSeparator />
          <ContextMenuItem
            className="text-red-500 focus:text-red-500"
            onClick={() =>
              alert({
                title: '删除',
                description: `确认删除文件 ”${file.name}” ？`,
                onConfirm() {
                  deleteFiles([file.id]).then(() => mutate())
                },
                warning: true
              })
            }
          >
            删除
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

function RenameDialog({ mutate }: { mutate: () => void }) {
  const { open, id, name, isFolder } = useFileStore.use.rename()
  const closeOperation = useFileStore.use.closeOperation()
  const [newName, setNewName] = useState('')
  useEffect(() => {
    if (!open) setNewName('')
  }, [open])
  const onRename = () => {
    if (!newName || !id) return
    renameFile(id, newName).then(() => {
      mutate()
      closeOperation('rename')
    })
  }
  return (
    <Dialog open={open} onOpenChange={() => closeOperation('rename')}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>重命名</DialogTitle>
          <DialogDescription>
            {`修改${isFolder ? '文件夹' : '文件'} "${name}" 的名称，点击确认应用修改！`}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="rename" className="text-right">
            新名称
          </Label>
          <Input
            id="rename"
            className="flex-1"
            autoComplete="off"
            value={newName}
            onChange={e => setNewName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={onRename} disabled={!newName}>
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RemoveDialog({ mutate }: { mutate: () => void }) {
  const { open, id, name, isFolder } = useFileStore.use.remove()
  const closeOperation = useFileStore.use.closeOperation()
  const [folderTree, setFolderTree] = useState<TreeItemData[]>([])
  const [selectedId, setSelectedId] = useState<string | undefined>('root')
  useEffect(() => {
    if (open) {
      getFolderTree().then(tree =>
        setFolderTree([
          {
            id: 'root',
            name: '我的文件',
            children: tree
          }
        ])
      )
    } else {
      setSelectedId('root')
      setFolderTree([])
    }
  }, [open])
  const onRemove = () => {
    if (!selectedId || !id) return
    removeFile(id, selectedId === 'root' ? undefined : selectedId).then(() => {
      mutate()
      closeOperation('remove')
    })
  }

  return (
    <Dialog open={open} onOpenChange={() => closeOperation('remove')}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>移动到</DialogTitle>
          <DialogDescription>
            {`移动${isFolder ? '文件夹' : '文件'} "${name}" 到指定目录，点击确认应用修改！`}
          </DialogDescription>
        </DialogHeader>
        <Tree
          className="h-[300px]"
          data={folderTree}
          onSelectChange={item => setSelectedId(item?.id)}
          initiateSelectedItemId="root"
          defaultExpandedItemIds={['root']}
          disableConditions={item => item.id === id}
          icon={<img src={folderPng} className="h-4 w-4" />}
        />
        <DialogFooter>
          <Button onClick={onRemove}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
