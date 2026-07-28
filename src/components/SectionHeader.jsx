export default function SectionHeader({ title, description, action, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div>
        <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
