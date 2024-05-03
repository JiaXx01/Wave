import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FolderUp } from 'lucide-react'
import { Outlet, useLocation } from 'react-router-dom'

export default function FileLayout() {
  const { pathname } = useLocation()
  const folders = decodeURIComponent(pathname.slice(1)).split('/')
  return (
    <div className="w-page flex flex-col">
      <header className="h-header flex items-center justify-between p-2">
        <div className="text-lg">{folders.at(-1)}</div>
        {/* <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((folder, index, breadcrumbs) => {
              return (
                <Fragment key={index}>
                  <BreadcrumbItem>{folder}</BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb> */}
        <Button>
          <FolderUp size="16" className="mr-2" />
          上传文件
        </Button>
      </header>
      <ScrollArea className="flex-1">
        <Outlet />
      </ScrollArea>
    </div>
  )
}
