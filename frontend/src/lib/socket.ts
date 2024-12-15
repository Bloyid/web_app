import { io } from 'socket.io-client'
import { create } from 'zustand'

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3001'

type SocketStore = {
  socket: any
  connect: (token: string) => void
  disconnect: () => void
}

export const useSocketStore = create<SocketStore>((set) => ({
  socket: null,
  connect: (token) => {
    const socket = io(SOCKET_URL, {
      auth: { token }
    })
    set({ socket })
  },
  disconnect: () => {
    set((state) => {
      state.socket?.disconnect()
      return { socket: null }
    })
  }
}))

export const useSocket = () => useSocketStore((state) => state.socket)