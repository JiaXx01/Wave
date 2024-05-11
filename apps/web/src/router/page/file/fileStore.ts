import { createSelectors } from '@/lib/store'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type FileState = {
  folderStack: { id: string; name: string }[]
  back: (id?: string | null) => void
  open: (id: string, name: string) => void

  renameState: {
    open: boolean
    id?: string
    name?: string
    isFolder?: boolean
  }
  openRename: (renameInfo: {
    id: string
    name: string
    isFolder: boolean
  }) => void
  closeRename: () => void
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
    open: (id, name) =>
      set(state => {
        state.folderStack.push({ id, name })
      }),

    renameState: {
      open: false
    },
    openRename: renameInfo =>
      set(state => {
        state.renameState = {
          open: true,
          ...renameInfo
        }
      }),
    closeRename: () =>
      set(state => {
        state.renameState = { open: false }
      })
  }))
)

const useFileStore = createSelectors(useFileStoreBase)

export default useFileStore
