import { useLocation } from 'react-router-dom'

export default function Files() {
  const { pathname } = useLocation()
  const path = pathname.slice(1)
  return <div>{path}</div>
}
