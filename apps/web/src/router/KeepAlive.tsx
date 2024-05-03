import { PropsWithChildren, ReactNode, createContext, useContext } from 'react'
import { matchPath, useLocation, useOutlet } from 'react-router-dom'

type KeepAliveLayoutProps = {
  keepPaths: Array<string | RegExp>
  keepElements?: Record<string, ReactNode>
  dropByPath?: (path: string) => void
} & PropsWithChildren

type KeepAliveContextType = Omit<Required<KeepAliveLayoutProps>, 'children'>

const keepElements: KeepAliveContextType['keepElements'] = {}

export const KeepAliveContext = createContext<KeepAliveContextType>({
  keepPaths: [],
  keepElements,
  dropByPath(path: string) {
    keepElements[path] = null
  }
})

const isKeepPath = (keepPaths: Array<string | RegExp>, path: string) => {
  let isKeep = false
  for (let i = 0; i < keepPaths.length; i++) {
    const item = keepPaths[i]
    if (item === path) {
      isKeep = true
    } else if (item instanceof RegExp && item.test(path)) {
      isKeep = true
    } else if (typeof item === 'string' && item.toLowerCase() === path) {
      isKeep = true
    }
  }
  return isKeep
}

export function useKeepOutlet() {
  const location = useLocation()
  const element = useOutlet()

  const { keepElements, keepPaths } = useContext(KeepAliveContext)
  const isKeep = isKeepPath(keepPaths, location.pathname)

  if (isKeep) {
    keepElements![location.pathname] = element
  }

  return (
    <>
      {Object.entries(keepElements).map(([pathname, element]) => (
        <div
          key={pathname}
          hidden={!matchPath(location.pathname, pathname)}
          className="h-full w-full relative overflow-hidden"
        >
          {element}
        </div>
      ))}
      {!isKeep && element}
    </>
  )
}

export default function KeepAliveLayout({
  keepPaths,
  ...other
}: KeepAliveLayoutProps) {
  const { keepElements, dropByPath } = useContext(KeepAliveContext)
  return (
    <KeepAliveContext.Provider
      value={{ keepPaths, keepElements, dropByPath }}
      {...other}
    ></KeepAliveContext.Provider>
  )
}
