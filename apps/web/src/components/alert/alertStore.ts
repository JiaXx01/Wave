import { create } from 'zustand'

export type Alert = {
  title: string
  description: string
  onConfirm?: (arg: unknown) => unknown
  confirmText?: string
  onCancel?: (arg: unknown) => unknown
  cancelText?: string
}

interface AlertState {
  open: boolean
  setOpen: (open: boolean) => void
  alert: Alert
  setAlert: (alert: Alert) => void
}

const useAlertStore = create<AlertState>()(set => ({
  open: false,
  setOpen: open => set(() => ({ open })),
  alert: {
    title: '',
    description: ''
  },
  setAlert: alert => set(() => ({ alert }))
}))

export default useAlertStore
