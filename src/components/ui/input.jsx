import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Input = forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academyRed/40 focus-visible:border-academyRed/50',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export const Label = forwardRef(({ className, ...props }, ref) => (
  <label ref={ref} className={cn('text-sm font-medium text-slate-700', className)} {...props} />
))
Label.displayName = 'Label'

export function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <Label htmlFor={htmlFor}>{label}</Label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  )
}
