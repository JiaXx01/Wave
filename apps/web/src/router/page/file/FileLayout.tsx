import {
  Breadcrumb,
  BreadcrumbItem,
  // BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
  // BreadcrumbEllipsis
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FolderUp } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export default function FileLayout() {
  return (
    <div className="w-page flex flex-col">
      <header className="h-header flex items-center justify-between p-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {/* <BreadcrumbLink asChild>文件</BreadcrumbLink> */}
              文件
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {/* <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator /> */}
            <BreadcrumbItem>
              {/* <BreadcrumbLink asChild>Components</BreadcrumbLink> */}
              组件
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
