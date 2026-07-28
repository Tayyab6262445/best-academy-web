import { forwardRef } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { cva } from 'class-variance-authority'
import Icon from '../Icon'
import { cn } from '../../lib/cn'

export const ToastProvider = ToastPrimitive.Provider

export const ToastViewport = forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 sm:bottom-4 sm:right-4',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = 'ToastViewport'

const toastVariants = cva(
  'group relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-popover data-[state=open]:animate-slide-in-from-bottom data-[state=closed]:animate-fade-out data-[swipe=end]:animate-slide-out-to-bottom',
  {
    variants: {
      variant: {
        default: 'border-slate-200 bg-white',
        success: 'border-green-200 bg-white',
        destructive: 'border-red-200 bg-white',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

const ICONS = { default: 'information-circle-outline', success: 'checkmark-circle', destructive: 'alert-circle-outline' }
const ICON_COLOR = { default: 'text-slate-400', success: 'text-green-600', destructive: 'text-red-600' }

export const Toast = forwardRef(({ className, variant = 'default', title, description, ...props }, ref) => (
  <ToastPrimitive.Root ref={ref} className={cn(toastVariants({ variant }), className)} {...props}>
    <Icon name={ICONS[variant]} size={20} className={cn('mt-0.5 shrink-0', ICON_COLOR[variant])} />
    <div className="flex-1">
      {title && <ToastPrimitive.Title className="text-sm font-semibold text-slate-900">{title}</ToastPrimitive.Title>}
      {description && (
        <ToastPrimitive.Description className="mt-0.5 text-sm text-slate-500">{description}</ToastPrimitive.Description>
      )}
    </div>
    <ToastPrimitive.Close className="rounded-sm text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academyRed/40">
      <Icon name="close" size={16} />
    </ToastPrimitive.Close>
  </ToastPrimitive.Root>
))
Toast.displayName = 'Toast'
