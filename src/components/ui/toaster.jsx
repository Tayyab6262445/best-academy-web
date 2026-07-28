import { Toast, ToastProvider, ToastViewport } from './toast'
import { useToast } from './use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, onOpenChange, ...props }) => (
        <Toast key={id} onOpenChange={onOpenChange} {...props} />
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
