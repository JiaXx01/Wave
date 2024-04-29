import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createNote } from '@/lib/api/note'

import { ListFilter, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NoteList from './NoteList'
import { useNotes } from '@/hooks/swr/note'

export default function AllNotes() {
  const navigate = useNavigate()
  const onCreateNote = () => {
    createNote().then(({ id }) => {
      navigate(`/note/${id}`)
    })
  }
  const { notes } = useNotes()
  return (
    <div className="h-full flex flex-col">
      <div className="h-header px-2 flex items-center gap-2">
        <div className=" text-lg">所有笔记</div>
        <div className="ml-auto flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.localStorage.removeItem('accessToken')
            }}
          >
            <ListFilter className="h-4 w-4 mr-1" />
            筛选
          </Button>
          <Button size="sm" onClick={onCreateNote}>
            <Plus className="h-4 w-4 mr-1" />
            创建笔记
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="h-5"></div>
        <div className="w-page">
          <NoteList notes={notes || []} />
        </div>
      </ScrollArea>
    </div>
  )
}
