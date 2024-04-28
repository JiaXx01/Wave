import React, { useEffect, useState } from 'react'
import {
  isSelectionExpanded,
  useEditorRef,
  useEditorSelector,
  useElement,
  useRemoveNodeButton
} from '@udecode/plate-common'
import {
  floatingMediaActions,
  FloatingMedia as FloatingMediaPrimitive,
  useFloatingMediaSelectors,
  submitFloatingMedia,
  TMediaElement
} from '@udecode/plate-media'
import { useReadOnly, useSelected } from 'slate-react'

import { Icons } from '@/components/plate-ui/icons'

import { Button, buttonVariants } from './button'
import { Popover, PopoverAnchor, PopoverContent } from './popover'
import { Separator } from './separator'
import { Input } from '../ui/input'

export interface MediaPopoverProps {
  pluginKey?: string
  children: React.ReactNode
}

export function MediaPopover({ pluginKey, children }: MediaPopoverProps) {
  const readOnly = useReadOnly()
  const selected = useSelected()

  const selectionCollapsed = useEditorSelector(
    editor => !isSelectionExpanded(editor),
    []
  )
  const isOpen = !readOnly && selected && selectionCollapsed
  const isEditing = useFloatingMediaSelectors().isEditing()

  useEffect(() => {
    if (!isOpen && isEditing) {
      floatingMediaActions.isEditing(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const editor = useEditorRef()
  const element = useElement<TMediaElement>()
  const { props: buttonProps } = useRemoveNodeButton({ element })

  const [imageLink, setImageLink] = useState('')

  const setImageMedia = (url: string) => {
    floatingMediaActions.url(url)
    submitFloatingMedia(editor, {
      element,
      pluginKey
    })
  }

  const embedImageLink = () => {
    if (!imageLink) return
    setImageMedia(imageLink)
  }

  if (readOnly) return <>{children}</>
  return (
    <Popover open={isOpen} modal={false}>
      <PopoverAnchor>{children}</PopoverAnchor>

      <PopoverContent
        className="w-auto p-1"
        onOpenAutoFocus={e => e.preventDefault()}
      >
        {isEditing ? (
          <div className="flex w-[330px] flex-col gap-1">
            <div className="flex gap-2">
              <Input
                placeholder="请输入图片链接"
                value={imageLink}
                onChange={e => setImageLink(e.target.value)}
              />
              <Button size="sm" onClick={embedImageLink}>
                嵌入链接
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={uploadFromLocal}
            >
              从本地上传
            </Button>
            {/* <div className="flex items-center">
              <div className="flex items-center pl-3 text-muted-foreground">
                <Icons.link className="size-4" />
              </div>

              <FloatingMediaPrimitive.UrlInput
                className={inputVariants({ variant: 'ghost', h: 'sm' })}
                placeholder="Paste the embed link..."
                options={{
                  pluginKey
                }}
              />
            </div> */}
          </div>
        ) : (
          <div className="box-content flex h-9 items-center gap-1">
            <FloatingMediaPrimitive.EditButton
              className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            >
              Edit link
            </FloatingMediaPrimitive.EditButton>

            <Separator orientation="vertical" className="my-1" />

            <Button variant="ghost" size="sms" {...buttonProps}>
              <Icons.delete className="size-4" />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
