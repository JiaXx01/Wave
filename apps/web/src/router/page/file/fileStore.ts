import { createSelectors } from '@/lib/store'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type FileState = {
  folderStack: { id: string; name: string }[]
  back: (id?: string | null) => void
  open: (id: string, name: string) => void
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
      })
  }))
)

const useFileStore = createSelectors(useFileStoreBase)

export default useFileStore
