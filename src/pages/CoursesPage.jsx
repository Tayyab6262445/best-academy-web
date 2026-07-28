import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetPdfsQuery } from '../api/attemptApi'
import { useGetSubjectsQuery } from '../api/testApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'

// Note: expo-screen-capture's screenshot-prevention (used in the RN app to
// discourage sharing course PDFs) has no browser equivalent — omitted, see
// TICKETS.md TICKET-11.
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
  } = useGetPdfsQuery(
    { classId, sectionId, subjectId: selectedSubject },
    { skip: !selectedSubject || !classId }
  )

  const pdfs = pdfData?.data?.pdfs

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="px-6 pt-10 pb-5">
          <div className="flex items-center justify-between">
            <h1 className="text-[28px] font-extrabold tracking-tight text-white">Our Library</h1>
            <Pressable onClick={() => navigate(-1)} className="rounded-[10px] bg-white/10 p-2">
              <Icon name="close-outline" size={24} color="white" />
            </Pressable>
          </div>
        </div>

        {/* Subject filter */}
        <div className="py-2.5">
          {subjectsLoading ? (
            <div className="ml-5">
              <Spinner color="#E31E24" />
            </div>
          ) : (
            <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-5 pb-1">
              {(subjectsData?.data || []).map((item) => {
                const isSelected = selectedSubject === item._id
                return (
                  <Pressable
                    key={item._id}
                    onClick={() => setSelectedSubject(item._id)}
                    className={`shrink-0 rounded-full border px-[18px] py-2.5 ${
                      isSelected ? 'border-academyRed bg-academyRed' : 'border-slate-700 bg-slate-800'
                    }`}
                  >
                    <span className={`text-[13px] font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {item.name}
                    </span>
                  </Pressable>
                )
              })}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mt-2.5 min-h-[60vh] rounded-t-[35px] bg-slate-100">
          <div className="mx-auto mt-3 h-[5px] w-10 rounded-full bg-slate-300" />

          {!selectedSubject ? (
            <div className="mt-16 flex flex-col items-center px-12 text-center">
              <div className="mb-5 flex h-[100px] w-[100px] items-center justify-center rounded-full bg-slate-200">
                <Icon name="search-outline" size={50} color="#CBD5E1" />
              </div>
              <p className="mb-2 text-xl font-extrabold text-slate-800">Select a Subject</p>
              <p className="text-sm font-medium leading-6 text-slate-500">
                Pick a course from the list above to access your curated learning materials.
              </p>
            </div>
          ) : pdfsLoading || isFetching ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="large" color="#E31E24" />
              <p className="mt-3 font-semibold tracking-wide text-slate-500">Syncing Files...</p>
            </div>
          ) : (
            <div className="p-6 pb-24">
              <p className="mb-4 pl-1 text-lg font-bold text-slate-800">Available Resources</p>

              {!pdfs || pdfs.length === 0 ? (
                <div className="mt-16 flex flex-col items-center px-12 text-center">
                  <Icon name="cloud-offline-outline" size={60} color="#E2E8F0" />
                  <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                    No documents found for this criteria.
                  </p>
                </div>
              ) : (
                pdfs.map((item) => (
                  <Pressable
                    key={item._id}
                    onClick={() =>
                      navigate(
                        `/pdf-viewer?fileUrl=${encodeURIComponent(item.fileUrl)}&title=${encodeURIComponent(item.title)}`
                      )
                    }
                    className="mb-4 flex w-full items-center rounded-[22px] border border-slate-200 bg-white p-3.5 text-left shadow-sm"
                  >
                    <div className="mr-4 flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-red-50">
                      <Icon name="document-text" size={24} color="#E31E24" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-bold text-slate-900">{item.title}</p>
                      <div className="mt-0.5 flex items-center">
                        <Icon name="time-outline" size={12} color="#94A3B8" />
                        <span className="ml-1 text-xs font-medium text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString()} •{' '}
                          {(item.fileSize / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-slate-50">
                      <Icon name="chevron-forward" size={18} color="#64748B" />
                    </div>
                  </Pressable>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
