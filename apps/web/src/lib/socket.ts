import { io } from 'socket.io-client'

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
  auth: cb => {
    cb({ token: window.localStorage.getItem('accessToken') })
  }
})
