import { useFiles } from '@/hooks/swr/file'

export default function FileList({ path }: { path: string }) {
  const { data } = useFiles(path)
  console.log(data)
  return <div>FileList</div>
}
