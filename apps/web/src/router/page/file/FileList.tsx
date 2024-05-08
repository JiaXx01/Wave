import { useFiles } from '@/hooks/swr/file'
import folderPng from '@/assets/file_icon/folder.png'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { FileInfo, FolderInfo } from '@/type'
import { getFileIcon } from '@/lib/file'
import { useNavigate } from 'react-router-dom'

export default function FileList({ path }: { path: string }) {
  const navigate = useNavigate()
  const { files, isLoading } = useFiles(path)
  if (isLoading || !files) return null
  if (!files) return navigate('/file', { replace: true })
  return (
    <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-6 lg:grid-cols-9 gap-3 p-2 place-self-center">
      {files.folders.map(folder => (
        <FolderItem key={folder.id} folder={folder} />
      ))}

      {files.files.map(file => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  )
}

function FolderItem({ folder }: { folder: FolderInfo }) {
  const navigate = useNavigate()
  return (
    <div className="place-self-center">
      <ContextMenu key={folder.id}>
        <ContextMenuTrigger>
          <div
            key={folder.id}
            className="w-[90px] flex flex-col items-center cursor-pointer"
            onClick={() => navigate(folder.path + '/' + folder.name)}
          >
            <div className="h-[75px] w-[75px]">
              <img src={folderPng} />
            </div>
            <div className="mt-1 h-8 w-full text-xs text-center line-clamp-2 break-words">
              {folder.name}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>重命名</ContextMenuItem>
          <ContextMenuItem>移动到</ContextMenuItem>
          <ContextMenuItem>复制</ContextMenuItem>
          <ContextMenuItem>删除</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}

function FileItem({ file }: { file: FileInfo }) {
  const fileIcon = getFileIcon(file.suffix)
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
            <div className="mt-1 h-8 w-full text-xs text-center line-clamp-2 break-words">
              {file.name}
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>重命名</ContextMenuItem>
          <ContextMenuItem>移动到</ContextMenuItem>
          <ContextMenuItem>复制</ContextMenuItem>
          <ContextMenuItem>删除</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
