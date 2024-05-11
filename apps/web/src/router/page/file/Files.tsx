import { Fragment } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import FileList from './FileList'
import useFileStore from './fileStore'
export default function Files() {
  const folderStack = useFileStore.use.folderStack()
  const back = useFileStore.use.back()
  return (
    <div className="w-page px-2">
      <ScrollArea className="h-7 w-full">
        {folderStack.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem>
                <button
                  className="text-nowrap"
                  onClick={() => {
                    back(null)
                  }}
                >
                  我的文件
                </button>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {folderStack.map(({ id, name }, index, folderStack) => {
                const length = folderStack.length

                return (
                  <Fragment key={index}>
                    {index === length - 1 ? (
                      <BreadcrumbPage className="text-nowrap">
                        {name}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbItem>
                        <button
                          className="text-nowrap"
                          onClick={() => {
                            back(id)
                          }}
                        >
                          {name}
                        </button>
                      </BreadcrumbItem>
                    )}
                    {index < length - 1 && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <FileList />
    </div>
  )
}
