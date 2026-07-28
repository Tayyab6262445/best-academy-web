import { forwardRef } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '../../lib/cn'

export const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold',
  {
    variants: {
      variant: {
        success: 'bg-green-50 text-green-700',
        danger: 'bg-red-50 text-red-700',
        warning: 'bg-amber-50 text-amber-700',
        neutral: 'bg-slate-100 text-slate-600',
        brand: 'bg-academyRed/10 text-academyRed',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  }
)

export const Badge = forwardRef(({ className, variant, ...props }, ref) => (
  <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
))
Badge.displayName = 'Badge'
