import { useRef, useState } from 'react'
import { cn } from '@udecode/cn'
import { CommentsProvider } from '@udecode/plate-comments'
import { Plate, Value } from '@udecode/plate-common'
// import { ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { commentsUsers, myUserId } from '@/lib/plate/comments'
import { MENTIONABLES } from '@/lib/plate/mentionables'
import { plugins } from '@/lib/plate/plate-plugins'
import { CommentsPopover } from '@/components/plate-ui/comments-popover'
import { CursorOverlay } from '@/components/plate-ui/cursor-overlay'
import { Editor } from '@/components/plate-ui/editor'
import { FixedToolbar } from '@/components/plate-ui/fixed-toolbar'
import { FixedToolbarButtons } from '@/components/plate-ui/fixed-toolbar-buttons'
import { FloatingToolbar } from '@/components/plate-ui/floating-toolbar'
import { FloatingToolbarButtons } from '@/components/plate-ui/floating-toolbar-buttons'
import { MentionCombobox } from '@/components/plate-ui/mention-combobox'
import { TooltipProvider } from '@/components/plate-ui/tooltip'
import { useDebounceEffect } from 'ahooks'
import { updateContent } from '@/lib/api/note'

export default function PlateEditor({
  id,
  content
}: {
  id: string
  content: Value | null
}) {
  const containerRef = useRef(null)
  const [value, setValue] = useState<Value>()

  useDebounceEffect(
    () => {
      if (!value) return
      updateContent(id, value)
    },
    [value],
    { wait: 500 }
  )

  return (
    <TooltipProvider>
      <DndProvider backend={HTML5Backend}>
        <CommentsProvider users={commentsUsers} myUserId={myUserId}>
          <Plate
            plugins={plugins}
            initialValue={content || undefined}
            onChange={setValue}
          >
            <div
              ref={containerRef}
              className={cn(
                'relative',
                // Block selection
                '[&_.slate-start-area-left]:!w-[64px] [&_.slate-start-area-right]:!w-[64px] [&_.slate-start-area-top]:!h-4'
              )}
            >
              <FixedToolbar>
                <FixedToolbarButtons />
              </FixedToolbar>

              <Editor
                className="px-10 sm:px-[70px] md:px-[96px] pt-4 pb-16"
                autoFocus
                focusRing={false}
                variant="ghost"
                size="md"
              />

              <FloatingToolbar>
                <FloatingToolbarButtons />
              </FloatingToolbar>

              <MentionCombobox items={MENTIONABLES} />

              <CommentsPopover />

              <CursorOverlay containerRef={containerRef} />
            </div>
          </Plate>
        </CommentsProvider>
      </DndProvider>
    </TooltipProvider>
  )
}
