import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Card = forwardRef(({ className, as: Comp = 'div', ...props }, ref) => (
  <Comp
    ref={ref}
    className={cn(
      'rounded-lg border border-slate-200/80 bg-white shadow-card',
      Comp !== 'div' && 'w-full text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academyRed/40',
      className
    )}
    {...props}
  />
))
Card.displayName = 'Card'

export const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col gap-1 p-5 pb-0', className)} {...props} />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-sm font-semibold text-slate-900', className)} {...props} />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-slate-500', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center gap-3 p-5 pt-0', className)} {...props} />
))
CardFooter.displayName = 'CardFooter'
