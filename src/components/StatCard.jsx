import Icon from './Icon'
import { Card } from './ui/card'
import { cn } from '../lib/cn'

const TONES = {
  neutral: 'bg-slate-100 text-slate-500',
  brand: 'bg-academyRed/10 text-academyRed',
  success: 'bg-green-50 text-green-600',
  danger: 'bg-red-50 text-red-600',
  warning: 'bg-amber-50 text-amber-600',
}

export default function StatCard({ icon, label, value, tone = 'neutral', className }) {
  return (
    <Card className={cn('flex items-center gap-3 p-4', className)}>
      {icon && (
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-md', TONES[tone])}>
          <Icon name={icon} size={18} />
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500">{label}</p>
        <p className="truncate text-lg font-semibold text-slate-900">{value}</p>
      </div>
    </Card>
  )
}
