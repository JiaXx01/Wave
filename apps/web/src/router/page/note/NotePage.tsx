import { FileText } from 'lucide-react'
import { useRef, useState } from 'react'
import { Note } from '@/type'
import { useLoaderData } from 'react-router-dom'

export default function NotePage() {
  const note = useLoaderData() as Note

  const [title, setTitle] = useState(note.title)
  const [editTitle, setEditTitle] = useState(title || '')
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const updateTitle = async () => {
    if (editTitle === title) return
    setTitle(editTitle)
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
                updateTitle()
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
      {/* <ScrollArea className="flex-1">
        <div className="w-page">
          <PlateEditor note={note as Note} />
        </div>
      </ScrollArea> */}
    </div>
  )
}
