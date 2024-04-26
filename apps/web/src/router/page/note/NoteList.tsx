import { useState } from 'react'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import { Checkbox } from '@/components/ui/checkbox'
import { FileTextIcon, ListChecksIcon, Trash2Icon, XIcon } from 'lucide-react'
import { NoteInfo } from '@/type'

export default function NoteList({ noteList }: { noteList: NoteInfo[] }) {
  const [showCheckBox, setShowCheckBox] = useState(false)
  const [selections, setSelections] = useImmer<Record<string, boolean>>({})

  const getIsAllRowsSelected = () => {
    return Object.values(noteList).every(note => selections[note.id])
  }
  const getIsSomeRowsSelected = () => {
    return Object.values(noteList).some(note => selections[note.id])
  }
  const toggleAllRowsSelected = (allSelected: boolean) => {
    if (allSelected) {
      setSelections(selections => {
        Object.values(noteList).forEach(note => {
          selections[note.id] = true
        })
      })
    } else {
      setSelections(() => ({}))
    }
  }

  const formatDate = (date: string) => {
    const now = dayjs()
    const targetDate = dayjs(date)
    if (now.isSame(targetDate, 'day')) {
      return targetDate.format('HH:mm:ss')
    } else if (now.isSame(targetDate, 'year')) {
      return targetDate.format('MM-DD HH:mm')
    } else {
      return targetDate.format('YYYY-MM-DD HH:mm')
    }
  }

  const onHiddenCheckBox = () => {
    setShowCheckBox(false)
    toggleAllRowsSelected(false)
  }

  const onDeleteNote = () => {}

  return (
    <div>
      <div className="sticky top-0 bg-background">
        <div className="h-full w-full flex gap-2 items-center text-muted-foreground text-xs px-2">
          <div className="flex-1 flex gap-2 items-center">
            {!showCheckBox ? (
              <ListChecksIcon
                size="16"
                className="cursor-pointer"
                onClick={() => setShowCheckBox(true)}
              />
            ) : (
              <Checkbox
                checked={
                  getIsAllRowsSelected() ||
                  (getIsSomeRowsSelected() && 'indeterminate')
                }
                onCheckedChange={checked => {
                  toggleAllRowsSelected(checked as boolean)
                }}
              />
            )}
            标题
          </div>
          <div className="hidden sm:block w-[110px]">创建时间</div>
          <div className="hidden sm:block w-[110px]">更改时间</div>
        </div>
      </div>
      <div>
        {noteList.map(note => (
          <div key={note.id} className="flex gap-2 items-center p-2 border-b">
            {showCheckBox && (
              <Checkbox
                checked={selections[note.id] || false}
                onCheckedChange={checked => {
                  setSelections(selections => {
                    if (checked) selections[note.id] = true
                    else delete selections[note.id]
                  })
                }}
              />
            )}
            <div className="flex-1 flex gap-2 items-center">
              <FileTextIcon size="16" />
              {note.title || '未命名'}
            </div>
            <div className="hidden sm:block w-[110px] text-xs text-muted-foreground">
              {formatDate(note.createTime)}
            </div>
            <div className="hidden sm:block w-[110px] text-xs text-muted-foreground">
              {formatDate(note.updateTime)}
            </div>
          </div>
        ))}
      </div>
      {showCheckBox && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 p-2 border shadow rounded-md flex items-center text-sm bg-background">
          <div>已选中 {Object.keys(selections).length} 篇笔记</div>
          <div className="flex ml-2">
            <button
              className="hover:bg-accent p-1 rounded-md"
              onClick={onHiddenCheckBox}
            >
              <XIcon size="18" />
            </button>
            <div className="w-[1px] border-l mx-1"></div>
            <button
              className="hover:bg-accent p-1 rounded-md"
              onClick={onDeleteNote}
            >
              <Trash2Icon size="18" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
