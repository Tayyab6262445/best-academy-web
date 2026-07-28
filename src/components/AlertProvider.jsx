import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Pressable from './Pressable'
import Icon from './Icon'

const AlertContext = createContext(null)

// Replaces RN's Alert.alert(...). Two shapes are used across the app:
//   alert(title, message)                         -> single "OK" dialog
//   confirm(title, message, { confirmText, ... })  -> Cancel/Confirm dialog, resolves to boolean
export function AlertProvider({ children }) {
  const [dialog, setDialog] = useState(null)
  const resolverRef = useRef(null)

  const close = useCallback((result) => {
    setDialog(null)
    if (resolverRef.current) {
      resolverRef.current(result)
      resolverRef.current = null
    }
  }, [])

  const alert = useCallback((title, message) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setDialog({ type: 'alert', title, message })
    })
  }, [])

  const confirm = useCallback((title, message, options = {}) => {
    return new Promise((resolve) => {
      resolverRef.current = resolve
      setDialog({
        type: 'confirm',
        title,
        message,
        confirmText: options.confirmText || 'Submit',
        cancelText: options.cancelText || 'Cancel',
      })
    })
  }, [])

  return (
    <AlertContext.Provider value={{ alert, confirm }}>
      {children}

      {dialog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 p-5">
          <div className="w-full max-w-sm rounded-[28px] bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <Icon
                name={dialog.type === 'confirm' ? 'help-circle-outline' : 'alert-circle-outline'}
                size={28}
                color="#E31E24"
              />
            </div>
            <h2 className="text-lg font-black tracking-tight text-slate-900">{dialog.title}</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">{dialog.message}</p>

            {dialog.type === 'confirm' ? (
              <div className="mt-6 flex gap-3">
                <Pressable
                  onClick={() => close(false)}
                  className="flex-1 rounded-2xl bg-slate-100 py-3.5 font-black uppercase tracking-widest text-slate-500 text-xs"
                >
                  {dialog.cancelText}
                </Pressable>
                <Pressable
                  onClick={() => close(true)}
                  className="flex-1 rounded-2xl bg-academyRed py-3.5 font-black uppercase tracking-widest text-white text-xs"
                >
                  {dialog.confirmText}
                </Pressable>
              </div>
            ) : (
              <Pressable
                onClick={() => close(true)}
                className="mt-6 w-full rounded-2xl bg-slate-900 py-3.5 font-black uppercase tracking-widest text-white text-xs"
              >
                OK
              </Pressable>
            )}
          </div>
        </div>
      )}
    </AlertContext.Provider>
  )
}

export function useAlert() {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}
