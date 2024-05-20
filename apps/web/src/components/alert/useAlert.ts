import useAlertStore, { Alert } from './alertStore'

export default function useAlert() {
  const open = useAlertStore(state => state.open)
  const setOpen = useAlertStore(state => state.setOpen)
  const setAlert = useAlertStore(state => state.setAlert)
  const alert = (alert: Alert) => {
    if (open || !alert) return
    setAlert(alert)
    setOpen(true)
  }
  return alert
}
