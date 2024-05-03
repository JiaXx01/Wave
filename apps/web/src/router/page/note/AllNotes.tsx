import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { createNote } from '@/lib/api/note'
import { ListFilter, Plus, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NoteList from './NoteList'
import { useNotes } from '@/hooks/swr/note'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Updater, useImmer } from 'use-immer'
import { useEffect, useMemo, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/plate-ui/popover'
import dayjs from 'dayjs'
import type { NoteInfo, Filter, FilterField } from '@/type'
import { calculateNotesFilterCondition, filterNotes } from '@/lib/filter'

const FIELD = {
  title: '标题',
  createTime: '创建时间',
  updateTime: '更新时间',
  shared: '已分享'
}

export default function AllNotes() {
  const navigate = useNavigate()
  const { notes, mutate } = useNotes()
  const onCreateNote = () => {
    createNote().then(({ id }) => {
      mutate()
      navigate(`/note/${id}`)
    })
  }

  const addFilter = (field: FilterField) => {
    setFilters(filters => {
      const filter: Filter = {
        key: Date.now().toString()
      }
      switch (field) {
        case 'title':
          filter.title = ''
          break
        case 'createTime':
        case 'updateTime':
          filter[field] = {
            before: true,
            time: new Date(new Date().toLocaleDateString())
          }
          break
        case 'shared':
          filter.shared = true
      }
      filters.push(filter)
    })
  }

  const [filters, setFilters] = useImmer<Filter[]>([])

  const visibleNotes = useMemo<NoteInfo[]>(() => {
    if (!notes) return []
    const filter = calculateNotesFilterCondition(filters)
    return filterNotes(notes, filter)
  }, [filters, notes])
  return (
    <div className="h-full flex flex-col">
      <header className="h-header px-2 flex items-center gap-2">
        <div className=" text-lg">所有笔记</div>
        <div className="ml-auto flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm" asChild>
                <span>
                  <ListFilter size="16" className="mr-1" />
                  筛选
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => addFilter('title')}>
                标题
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addFilter('createTime')}>
                创建时间
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addFilter('updateTime')}>
                更新时间
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addFilter('shared')}>
                已分享
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" onClick={onCreateNote}>
            <Plus className="h-4 w-4 mr-1" />
            创建笔记
          </Button>
        </div>
      </header>
      <ScrollArea className="flex-1">
        <Filter filters={filters} setFilters={setFilters} />
        <div className="w-page">
          <NoteList notes={visibleNotes} mutate={mutate} />
        </div>
      </ScrollArea>
    </div>
  )
}

function Filter({
  filters,
  setFilters
}: {
  filters: Filter[]
  setFilters: Updater<Filter[]>
}) {
  if (!filters.length) return null
  return (
    <div className="p-2 flex flex-wrap gap-2">
      {filters.map((filter, index) => (
        <FilterCondition
          key={filter.key}
          filter={filter}
          setFilters={setFilters}
          index={index}
        />
      ))}
    </div>
  )
}

function FilterCondition({
  filter,
  setFilters,
  index
}: {
  filter: Filter
  setFilters: Updater<Filter[]>
  index: number
}) {
  const [field, setField] = useState<FilterField>(() => {
    return Object.keys(filter).filter(key => key !== 'key')[0] as FilterField
  })

  useEffect(() => {
    setFilter(filter => {
      const _filter = {}
      switch (field) {
        case 'title':
          filter.title = ''
          break
        case 'createTime':
        case 'updateTime':
          filter[field] = {
            before: true,
            time: new Date(new Date().toLocaleDateString())
          }
          break
        case 'shared':
          filter.shared = true
      }
      filter = _filter
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field])

  const setFilter = (arg: Filter | ((filter: Filter) => void)) =>
    setFilters(filters => {
      const key = filters[index].key
      if (typeof arg === 'function') {
        arg(filters[index])
      } else {
        filters[index] = { ...arg, key }
      }
    })

  const removeFilter = () => {
    setFilters(filters => {
      filters.splice(index, 1)
    })
  }

  return (
    <div className="py-1 px-2 border shadow-sm rounded flex items-center gap-2 text-xs">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>{FIELD[field]}</button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setField('title')}>
            标题
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setField('createTime')}>
            创建时间
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setField('updateTime')}>
            更新时间
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setField('shared')}>
            已分享
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {field === 'title' && (
        <input
          className="w-[100px] outline-none"
          onBlur={e => {
            setFilter(filter => {
              filter.title = e.target.value
            })
          }}
        ></input>
      )}
      {(field === 'createTime' || field === 'updateTime') && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="font-light text-gray-600">
                {filter[field]?.before ? '早于' : '晚于'}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  setFilter(filter => {
                    filter[field]!.before = true
                  })
                }
              >
                早于
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setFilter(filter => {
                    filter[field]!.before = false
                  })
                }
              >
                晚于
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Popover>
            <PopoverTrigger asChild>
              <button>{dayjs(filter[field]?.time).format('MM-DD')}</button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filter[field]?.time}
                onSelect={date => {
                  if (!date) return
                  setFilter(filter => {
                    filter[field]!.time = date
                  })
                }}
              />
            </PopoverContent>
          </Popover>
        </>
      )}
      {field === 'shared' && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="font-light">
              {filter.shared ? '是' : '否'}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setFilter(filter => {
                  filter.shared = true
                })
              }}
            >
              是
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setFilter(filter => {
                  filter.shared = false
                })
              }}
            >
              否
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <button className="p-1 rounded hover:bg-accent" onClick={removeFilter}>
        <X size="12" />
      </button>
    </div>
  )
}
