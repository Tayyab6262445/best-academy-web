import { forwardRef } from 'react'
import { cn } from '../../lib/cn'

export const Table = forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-x-auto rounded-lg border border-slate-200">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
))
Table.displayName = 'Table'

export const TableHeader = forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('bg-slate-50', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

export const TableBody = forwardRef(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('divide-y divide-slate-100', className)} {...props} />
))
TableBody.displayName = 'TableBody'

export const TableRow = forwardRef(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('transition-colors hover:bg-slate-50/80', className)} {...props} />
))
TableRow.displayName = 'TableRow'

export const TableHead = forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn('h-10 whitespace-nowrap px-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500', className)}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

export const TableCell = forwardRef(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('px-4 py-3 align-middle text-slate-700', className)} {...props} />
))
TableCell.displayName = 'TableCell'
