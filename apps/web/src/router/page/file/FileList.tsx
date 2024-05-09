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
import { getFileIcon } from '@/lib/file'
import { useNavigate } from 'react-router-dom'
import useAlert from '@/components/alert/useAlert'
import { deleteFiles, deleteFolders } from '@/lib/api/file'

export default function FileList({ path }: { path: string }) {
  const navigate = useNavigate()
  const { files, isLoading, mutate } = useFiles(path)
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
  const navigate = useNavigate()
  const alert = useAlert()
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
