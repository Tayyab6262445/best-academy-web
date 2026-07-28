import Icon from '../Icon'
import Button from './button'
import { cn } from '../../lib/cn'

export function Pagination({ page, pageCount, onPageChange, className }) {
  if (pageCount <= 1) return null

  const pages = getPageList(page, pageCount)

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-700">{page}</span> of {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <Icon name="chevron-back" size={16} />
        </Button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400">
              …
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'secondary' : 'outline'}
              size="icon"
              className="text-sm"
              onClick={() => onPageChange(p)}
            >
              {p}
            </Button>
          )
        )}
        <Button variant="outline" size="icon" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <Icon name="chevron-forward" size={16} />
        </Button>
      </div>
    </div>
  )
}

function getPageList(page, pageCount) {
  const delta = 1
  const range = []
  const rangeWithDots = []
  let last

  for (let i = 1; i <= pageCount; i++) {
    if (i === 1 || i === pageCount || (i >= page - delta && i <= page + delta)) {
      range.push(i)
    }
  }

  for (const i of range) {
    if (last) {
      if (i - last === 2) rangeWithDots.push(last + 1)
      else if (i - last > 2) rangeWithDots.push('...')
    }
    rangeWithDots.push(i)
    last = i
  }

  return rangeWithDots
}
