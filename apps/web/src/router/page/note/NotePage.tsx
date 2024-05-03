import { FileText } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useRef, useState } from 'react'
import { Note } from '@/type'
import { useLoaderData } from 'react-router-dom'
import { updateTitle } from '@/lib/api/note'
import PlateEditor from './PlateEditor'
import { mutate } from 'swr'
import { useToast } from '@/components/ui/use-toast'

export default function NotePage() {
  const note = useLoaderData() as Note
  const { toast } = useToast()
  const [title, setTitle] = useState(note.title)
  const [editTitle, setEditTitle] = useState(title || '')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const onUpdateTitle = async () => {
    if (!editTitle || editTitle === title) return
    if (editTitle.length > 15) {
      setEditTitle(title)
      toast({
        description: '笔记标题超过15个字符'
      })
      return
    }
    setTitle(editTitle)
    await updateTitle(note.id, editTitle)
    mutate('/note')
  }

  return (
    <div className="h-full flex flex-col w-page">
      <div className="h-header px-2 flex gap-2 items-center">
        <div className="flex items-center gap-2">
          <FileText size="20" />
          {isEditingTitle ? (
            <input
              className="pl-1"
              ref={titleInputRef}
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              onBlur={() => {
                setIsEditingTitle(false)
                onUpdateTitle()
              }}
            />
          ) : (
            <div
              className="max-w-[170px] overflow-hidden text-ellipsis cursor-pointer hover:underline"
              onClick={() => {
                setIsEditingTitle(true)
                setTimeout(() => {
                  titleInputRef.current?.focus()
                }, 10)
              }}
            >
              {title || '未命名'}
            </div>
          )}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="w-page">
          <PlateEditor id={note.id} content={note.content} />
        </div>
      </ScrollArea>
    </div>
  )
}
