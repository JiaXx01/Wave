import useAlertStore from './alertStore'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'

export default function Alerter() {
  const open = useAlertStore(state => state.open)
  const setOpen = useAlertStore(state => state.setOpen)
  const { title, description, confirmText, cancelText, onConfirm, onCancel } =
    useAlertStore(state => state.alert)
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText || '取消'}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText || '确认'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
