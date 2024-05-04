import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import FileList from './FileList'
export default function Files() {
  const { pathname } = useLocation()
  const path = decodeURIComponent(pathname)
  const folders = path.slice(1).split('/')
  return (
    <div className="px-2">
      {folders.length > 1 && (
        <ScrollArea className="w-page">
          <Breadcrumb>
            <BreadcrumbList>
              {folders.map((folder, index, breadcrumbs) => {
                const length = breadcrumbs.length
                const path = '/' + breadcrumbs.slice(0, index + 1).join('/')
                return (
                  <Fragment key={index}>
                    {index === length - 1 ? (
                      <BreadcrumbPage>{folder}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link to={path}>{folder}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    )}
                    {index < length - 1 && <BreadcrumbSeparator />}
                  </Fragment>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      <FileList path={path} />
    </div>
  )
}
