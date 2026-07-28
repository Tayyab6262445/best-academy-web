import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Button from '../components/ui/button'

export default function PdfViewerPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const fileUrl = searchParams.get('fileUrl')
  const title = searchParams.get('title')

  // Google Docs Viewer renders the PDF reliably cross-browser, same
  // approach the RN app used inside its WebView.
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl || '')}&embedded=true`

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
          <Icon name="arrow-back" size={18} />
        </Button>
        <h1 className="flex-1 truncate text-sm font-semibold text-slate-900">{title || 'Document View'}</h1>
      </div>

      {fileUrl ? (
        <iframe title={title || 'PDF document'} src={googleDocsUrl} className="flex-1 border-0" />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-slate-500">No document specified.</p>
        </div>
      )}
    </div>
  )
}
