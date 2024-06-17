import { createSelectors } from '@/lib/store'
import { FriendRequest, PendingMessage } from '@/type/chat'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

type ChatState = {
  initPendingMessage: (pendingMessage: PendingMessage) => void
  friendRequestList: FriendRequest[]
  removeFriendRequest: (id: string) => void
}

const useChatStoreBase = create<ChatState>()(
  immer(set => ({
    initPendingMessage: pendingMessage =>
      set(state => {
        state.friendRequestList = pendingMessage.friendRequestList
      }),

    friendRequestList: [],
    removeFriendRequest: id =>
      set(state => {
        state.friendRequestList = state.friendRequestList.filter(
          request => request.id !== id
        )
      })
  }))
)

const useChatStore = createSelectors(useChatStoreBase)

export default useChatStore
