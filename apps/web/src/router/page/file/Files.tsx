import { Fragment } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Breadcrumb,
  BreadcrumbItem,
  // BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
  // BreadcrumbEllipsis
} from '@/components/ui/breadcrumb'
export default function Files() {
  const { pathname } = useLocation()
  const path = decodeURIComponent(pathname.slice(1))
  const folders = path.split('/')
  return (
    <div className="px-2">
      <Breadcrumb>
        <BreadcrumbList>
          {folders.map((folder, index, breadcrumbs) => {
            const length = breadcrumbs.length
            return (
              <Fragment key={index}>
                {index === length - 1 ? (
                  <BreadcrumbPage>{folder}</BreadcrumbPage>
                ) : (
                  <BreadcrumbItem>{folder}</BreadcrumbItem>
                )}
                {index < length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
