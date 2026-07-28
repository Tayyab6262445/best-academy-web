import { useEffect, useState } from 'react'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

let count = 0
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return String(count)
}

let memoryState = { toasts: [] }
const listeners = []

function dispatch(action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_TOAST':
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case 'DISMISS_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.id ? { ...t, open: false } : t)),
      }
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }
    default:
      return state
  }
}

export function toast({ variant = 'default', title, description } = {}) {
  const id = genId()

  const update = (props) => dispatch({ type: 'ADD_TOAST', toast: { ...props, id, open: true } })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      id,
      variant,
      title,
      description,
      open: true,
      onOpenChange: (open) => {
        if (!open) {
          dismiss()
          setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 200)
        }
      },
    },
  })

  setTimeout(dismiss, TOAST_REMOVE_DELAY)

  return { id, update, dismiss }
}

export function useToast() {
  const [state, setState] = useState(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return { ...state, toast }
}
