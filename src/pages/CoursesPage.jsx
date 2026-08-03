import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetPdfsQuery } from '../api/attemptApi'
import { useGetSubjectsQuery } from '../api/testApi'
import Icon from '../components/Icon'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import EmptyState from '../components/EmptyState'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'

// Note: expo-screen-capture's screenshot-prevention (used in the RN app to
// discourage sharing course PDFs) has no browser equivalent — omitted, see
// TICKETS.md TICKET-11. Downloading is deterred instead: documents render in
// our own canvas-based viewer (PdfCanvasViewer, no iframe/native PDF plugin,
// so no built-in download/print controls exist), and the raw file URL is
// passed via router state rather than a visible/bookmarkable query string.
export default function CoursesPage() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState(null)

  const classId = user?.class
  const sectionId = user?.section

  const { data: subjectsData, isLoading: subjectsLoading } = useGetSubjectsQuery(classId, {
    skip: !classId,
  })

  const {
    data: pdfData,
    isLoading: pdfsLoading,
    isFetching,
  } = useGetPdfsQuery({ classId, sectionId, subjectId: selectedSubject }, { skip: !selectedSubject || !classId })

  const pdfs = pdfData?.data?.pdfs
  const subjects = subjectsData?.data || []

  const handleOpenPdf = (pdf) => {
    navigate('/pdf-viewer', { state: { url: pdf.fileUrl, title: pdf.title } })
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Course Library</h2>
        <p className="text-sm text-slate-500">Select a subject to access your curated learning materials.</p>
      </div>

      {subjectsLoading ? (
        <Skeleton className="h-9 w-64" />
      ) : (
        <>
          <div className="hidden md:block">
            <Tabs value={selectedSubject ?? ''} onValueChange={setSelectedSubject}>
              <TabsList className="flex-wrap">
                {subjects.map((item) => (
                  <TabsTrigger key={item._id} value={item._id}>
                    {item.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 md:hidden">
            {subjects.map((item) => {
              const isSelected = selectedSubject === item._id
              return (
                <button
                  key={item._id}
                  onClick={() => setSelectedSubject(item._id)}
                  className={`shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-500'
                  }`}
                >
                  {item.name}
                </button>
              )
            })}
          </div>
        </>
      )}

      {!selectedSubject ? (
        <EmptyState
          icon="search-outline"
          title="Select a subject"
          description="Pick a course from the list above to access your curated learning materials."
        />
      ) : pdfsLoading || isFetching ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : !pdfs || pdfs.length === 0 ? (
        <EmptyState icon="cloud-offline-outline" title="No documents found" description="No documents found for this criteria." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pdfs.map((item) => (
            <Card
              as="button"
              key={item._id}
              onClick={() => handleOpenPdf(item)}
              className="flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-popover"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-red-50">
                <Icon name="document-text" size={20} className="text-academyRed" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString()} • {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Icon name="chevron-forward" size={16} className="shrink-0 text-slate-400" />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
