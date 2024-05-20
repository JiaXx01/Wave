import { createSelectors } from '@/lib/store'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type OperationState = {
  open: boolean
  id?: string
  name?: string
  isFolder?: boolean
}

type Operation = 'rename' | 'remove'

type FolderStack = { id: string; name: string }[]

type FileState = {
  folderStack: FolderStack
  back: (id?: string | null) => void
  goto: (id: string, name: string) => void
  jumpTo: (folderStack: FolderStack) => void

  rename: OperationState
  remove: OperationState

  openOperation: (
    operation: Operation,
    targetInfo: {
      id?: string
      name?: string
      isFolder?: boolean
    }
  ) => void
  closeOperation: (operation: Operation) => void
}

const useFileStoreBase = create<FileState>()(
  immer(set => ({
    folderStack: [],
    back: id =>
      set(state => {
        if (id === null) {
          state.folderStack = []
        } else if (id) {
          const index = state.folderStack.findIndex(folder => folder.id === id)
          state.folderStack = state.folderStack.slice(0, index + 1)
        } else {
          state.folderStack.pop()
        }
      }),
    goto: (id, name) =>
      set(state => {
        state.folderStack.push({ id, name })
      }),
    jumpTo: folderStack =>
      set(state => {
        state.folderStack = folderStack
      }),

    rename: {
      open: false
    },
    remove: {
      open: false
    },
    openOperation: (operation, targetInfo) =>
      set(state => {
        state[operation] = {
          open: true,
          ...targetInfo
        }
      }),
    closeOperation: operation =>
      set(state => {
        state[operation] = { open: false }
      })
  }))
)

const useFileStore = createSelectors(useFileStoreBase)

export default useFileStore
