import { useLoaderData } from 'react-router-dom'

export default function Note() {
  const data = useLoaderData()
  console.log(data)
  return <div>Note</div>
}
