import { useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'

export default function PdfViewerPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const fileUrl = searchParams.get('fileUrl')
  const title = searchParams.get('title')

  // Google Docs Viewer renders the PDF reliably cross-browser, same
  // approach the RN app used inside its WebView.
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl || '')}&embedded=true`

  return (
    <div className="flex min-h-screen flex-col bg-[#0F172A]">
      <div className="flex items-center bg-[#1E293B] p-4">
        <Pressable onClick={() => navigate(-1)} className="mr-[15px]">
          <Icon name="arrow-back" size={24} color="white" />
        </Pressable>
        <h1 className="flex-1 truncate text-lg font-bold text-white">{title || 'Document View'}</h1>
      </div>

      {fileUrl ? (
        <iframe title={title || 'PDF document'} src={googleDocsUrl} className="flex-1 border-0" />
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-white">No document specified.</p>
        </div>
      )}
    </div>
  )
}
