import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import dayjs from 'dayjs'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Copy,
  Ellipsis,
  FileDown,
  FileTextIcon,
  Link,
  ListChecksIcon,
  PackageOpen,
  SquareArrowOutUpRight,
  Trash2,
  Trash2Icon,
  XIcon
} from 'lucide-react'
import { NoteInfo } from '@/type'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { deleteNotes } from '@/lib/api/note'
import { useNavigate } from 'react-router-dom'

type SortField = 'createTime' | 'updateTime'
type SortOrder = boolean | undefined
type Sort = Record<SortField, SortOrder>
const DEFAULT_SORT: Sort = {
  createTime: undefined,
  updateTime: undefined
}

export default function NoteList({
  notes,
  mutate
}: {
  notes: NoteInfo[]
  mutate: () => void
}) {
  const navigate = useNavigate()
  const { toast } = useToast()

  const NOTE_ACTIONS = {
    open(id: string) {
      navigate(`/note/${id}`)
    },
    copy(id: string) {
      return id
    },
    export(id: string) {
      return id
    },
    shareLink(id: string) {
      return id
    },
    newTabOpen(id: string) {
      window.open(`note/${id}`)
    },
    async delete(ids: string[]) {
      deleteNotes(ids).then(() => {
        mutate()
      })
    }
  }

  // 选择
  const [showCheckBox, setShowCheckBox] = useState(false)
  const [selections, setSelections] = useImmer<Record<string, boolean>>({})

  useEffect(() => {
    setSelections(selections => {
      const idHash: Record<string, string> = {}
      notes.forEach(note => {
        idHash[note.id] = ' '
      })
      Object.keys(selections).forEach(id => {
        if (!idHash.id) delete selections[id]
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes])

  const getIsAllRowsSelected = () => {
    return Object.values(notes).every(note => selections[note.id])
  }
  const getIsSomeRowsSelected = () => {
    return Object.values(notes).some(note => selections[note.id])
  }
  const toggleAllRowsSelected = (allSelected: boolean) => {
    if (allSelected) {
      setSelections(selections => {
        Object.values(notes).forEach(note => {
          selections[note.id] = true
        })
      })
    } else {
      setSelections(() => ({}))
    }
  }

  const onHiddenCheckBox = () => {
    setShowCheckBox(false)
    toggleAllRowsSelected(false)
  }

  // 格式化时间
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

  // 排序
  const [noteList, setNoteList] = useState(notes)
  const [sort, setSort] = useState<Sort>({ ...DEFAULT_SORT, createTime: false })
  const changeSort = (field: SortField) => {
    setSort(sort => ({
      ...DEFAULT_SORT,
      [field]: !sort[field]
    }))
  }
  useEffect(() => {
    const field = (Object.keys(sort) as SortField[]).find(
      field => sort[field] !== undefined
    )
    if (!field) return
    const order = sort[field] as boolean
    setNoteList(() => {
      return notes.toSorted((a, b) => {
        const timeA = new Date(a[field]).getTime()
        const timeB = new Date(b[field]).getTime()
        if (order) {
          return timeA - timeB
        } else {
          // 降序
          return timeB - timeA
        }
      })
    })
  }, [sort, notes])

  return (
    <>
      {notes.length === 0 ? (
        <div className="flex flex-col items-center text-muted-foreground mt-[200px]">
          <PackageOpen absoluteStrokeWidth strokeWidth="3" size="160" />
          <div>这里没有笔记</div>
        </div>
      ) : (
        <div>
          <div className="sticky top-0 bg-background">
            <div className="h-full w-full flex gap-2 items-center text-muted-foreground text-xs p-2 pb-2">
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
                <div className="flex gap-1 items-center select-none">标题</div>
              </div>
              <div
                className="hidden sm:flex gap-1 items-center w-[110px] hover:cursor-pointer select-none"
                onClick={() => changeSort('createTime')}
              >
                创建时间
                <SortIcon order={sort.createTime} />
              </div>
              <div
                className="hidden sm:flex gap-1 items-center w-[110px] hover:cursor-pointer select-none"
                onClick={() => changeSort('updateTime')}
              >
                更改时间
                <SortIcon order={sort.updateTime} />
              </div>
              <div className="w-[26px]"></div>
            </div>
          </div>
          <div>
            {noteList.map(note => (
              <div
                key={note.id}
                className="flex gap-2 items-center p-2 hover:bg-accent"
              >
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
                <div className="flex-1 flex">
                  <div
                    className="flex items-center gap-2 hover:underline hover:cursor-pointer"
                    onClick={() => NOTE_ACTIONS.open(note.id)}
                  >
                    <FileTextIcon size="16" />
                    {note.title}
                  </div>
                  <div className="flex-1"></div>
                </div>
                <div className="hidden sm:block w-[110px] text-xs text-muted-foreground">
                  {formatDate(note.createTime)}
                </div>
                <div className="hidden sm:block w-[110px] text-xs text-muted-foreground">
                  {formatDate(note.updateTime)}
                </div>
                <div className="text-muted-foreground">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-md">
                        <Ellipsis size="18" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => NOTE_ACTIONS.copy(note.id)}
                      >
                        <Copy size="16" className="mr-2" />
                        复制
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => NOTE_ACTIONS.export(note.id)}
                      >
                        <FileDown size="16" className="mr-2" />
                        导出
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => NOTE_ACTIONS.shareLink(note.id)}
                      >
                        <Link size="16" className="mr-2" />
                        分享链接
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => NOTE_ACTIONS.newTabOpen(note.id)}
                      >
                        <SquareArrowOutUpRight size="16" className="mr-2" />
                        新标签页打开
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500 focus:text-red-500"
                        onClick={() => {
                          toast({
                            variant: 'destructive',
                            title: `删除笔记 —— ${note.title}`,
                            description: '删除后无法恢复！',
                            action: (
                              <ToastAction
                                altText="Delete"
                                onClick={() => NOTE_ACTIONS.delete([note.id])}
                              >
                                删除
                              </ToastAction>
                            )
                          })
                        }}
                      >
                        <Trash2 size="16" className="mr-2" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  onClick={() => {
                    const selectedIds = Object.keys(selections)
                    if (selectedIds.length === 0) return
                    toast({
                      variant: 'destructive',
                      title: `删除选中的${selectedIds.length}篇笔记`,
                      description: '删除后无法恢复！',
                      action: (
                        <ToastAction
                          altText="Delete"
                          onClick={() => NOTE_ACTIONS.delete(selectedIds)}
                        >
                          删除
                        </ToastAction>
                      )
                    })
                  }}
                >
                  <Trash2Icon size="18" color="red" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

function SortIcon({ order }: { order: SortOrder }) {
  if (order === undefined) return null
  return (
    <>
      {order ? (
        <ArrowUpWideNarrow size="12" />
      ) : (
        <ArrowDownWideNarrow size="12" />
      )}
    </>
  )
}
