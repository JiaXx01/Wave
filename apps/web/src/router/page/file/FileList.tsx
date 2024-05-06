import { useFiles } from '@/hooks/swr/file'
import folderPng from '@/assets/folder.png'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'

export default function FileList({ path }: { path: string }) {
  const { data, isLoading } = useFiles(path)
  if (isLoading) return null
  console.log(data)
  return (
    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3 p-2">
      {data.folders.map(folder => (
        <ContextMenu key={folder.id}>
          <ContextMenuTrigger>
            <div
              key={folder.id}
              className="flex flex-col items-center cursor-pointer hover:bg-accent rounded-md"
            >
              <img src={folderPng} />
              <div className="px-4 w-full overflow-hidden text-ellipsis text-nowrap text-xs text-center">
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
      ))}
    </div>
  )
}
