import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import Icon from '../components/Icon'
import Button from '../components/ui/button'
import PdfCanvasViewer from '../components/PdfCanvasViewer'
import dayjs from 'dayjs'

// True screenshot prevention has no browser equivalent (see CoursesPage) —
// this page instead avoids offering any download at all: the document is
// rendered as canvas pixels via PdfCanvasViewer (pdf.js) rather than an
// iframe/native PDF plugin, so there is no built-in download/print/"open in
// new tab" control anywhere in the UI. Right-click and text selection are
// disabled, and a visible watermark (student name + roll number + date)
// makes any screenshot or photo traceable back to the viewing student.
export default function PdfViewerPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  const url = location.state?.url
  const title = location.state?.title
  const watermarkText = user ? `${user.name} • ${user.rollNumber}` : 'Best Academy'

  return (
    <div className="flex min-h-screen select-none flex-col bg-slate-50" onContextMenu={(e) => e.preventDefault()}>
      <style>{'@media print { body { display: none !important; } }'}</style>

      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
          <Icon name="arrow-back" size={18} />
        </Button>
        <h1 className="flex-1 truncate text-sm font-semibold text-slate-900">{title || 'Document View'}</h1>
      </div>

      <p className="border-b border-amber-100 bg-amber-50 px-4 py-1.5 text-center text-xs text-amber-700">
        Licensed exclusively to {watermarkText} — do not share or redistribute.
      </p>

      {url ? (
        <div className="relative flex flex-1 flex-col">
          <PdfCanvasViewer url={url} />

          {/* Tiled watermark overlay — traceability, not prevention */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 gap-16 overflow-hidden opacity-[0.12]">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className="-rotate-[30deg] whitespace-nowrap text-sm font-semibold text-slate-900">
                {watermarkText} · {dayjs().format('DD MMM YYYY')}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-slate-500">No document specified.</p>
          <Button onClick={() => navigate('/courses')}>Go to courses</Button>
        </div>
      )}
    </div>
  )
}
