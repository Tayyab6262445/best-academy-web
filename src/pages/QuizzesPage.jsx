import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetSectionsByClassQuery, useGetPublishedTestsMutation } from '../api/attemptApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'

export default function QuizzesPage() {
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()
  const [selectedSubjectId, setSelectedSubjectId] = useState(null)

  const { data: subjectData } = useGetSectionsByClassQuery(user?.class, { skip: !user?.class })
  const [fetchTests, { data: testResponse, isLoading: isTestsLoading }] = useGetPublishedTestsMutation()

  useEffect(() => {
    if (selectedSubjectId && user?.class && user?.section) {
      fetchTests({
        classId: user.class,
        sectionId: user.section,
        subjectId: selectedSubjectId,
        page: 1,
        limit: 10,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubjectId])

  const tests = testResponse?.data?.tests

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl">
        {/* Branding & title */}
        <div className="mb-5 mt-4 flex items-end justify-between px-5">
          <img src={logo} alt="Best Academy" className="h-14 w-14 object-contain" />
          <div>
            <p className="text-3xl font-black tracking-tighter text-slate-900">Online Tests</p>
            <p className="italic font-medium text-slate-500">Assessment Portal</p>
          </div>
          <div className="rounded-2xl bg-academyRed/10 p-2">
            <Icon name="analytics" size={24} color="#E31E24" />
          </div>
        </div>

        {/* Subject selection */}
        <div className="border-b border-slate-100 bg-white pt-2">
          <div className="mb-2 flex items-center px-5">
            <div className="mr-2 h-3.5 w-1 rounded-full bg-academyRed" />
            <p className="text-xs font-black uppercase tracking-wider text-slate-900">Select Subject</p>
          </div>

          <div className="no-scrollbar flex gap-6 overflow-x-auto px-5 pb-1">
            {(subjectData?.data || []).map((item) => {
              const isSelected = selectedSubjectId === item._id
              return (
                <Pressable
                  key={item._id}
                  onClick={() => setSelectedSubjectId(item._id)}
                  className="relative shrink-0 pt-2 pb-3"
                >
                  <span
                    className={`text-[14px] font-extrabold tracking-wide ${
                      isSelected ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isSelected && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-academyRed" />
                  )}
                </Pressable>
              )
            })}
          </div>
        </div>

        {/* Test list */}
        <div className="px-6 pt-6">
          <div className="mb-4 flex items-center justify-between">
            <SectionHeader title="Available Assessments" />
            {tests?.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400">{tests.length} FOUND</span>
            )}
          </div>

          {isTestsLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Spinner size="large" color="#E31E24" />
              <p className="mt-4 font-bold text-slate-400">Fetching your tests...</p>
            </div>
          ) : !tests || tests.length === 0 ? (
            <div className="mt-10 flex flex-col items-center justify-center px-10 text-center">
              <div className="mb-4 rounded-full bg-slate-50 p-8">
                <Icon name="search-outline" size={40} color="#CBD5E1" />
              </div>
              <p className="text-center text-lg font-black text-slate-900">No Tests Found</p>
              <p className="mt-2 text-center leading-5 text-slate-400">
                Select a subject from the top menu to view available assessments for your class.
              </p>
            </div>
          ) : (
            <div className="pb-10">
              {tests.map((item) => (
                <Pressable
                  key={item._id}
                  onClick={() => navigate(`/test-attempt?testId=${item._id}`)}
                  className="mb-4 flex w-full items-center rounded-[32px] border border-slate-100 bg-white p-5 text-left shadow-sm shadow-slate-200"
                >
                  <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                    <Icon name="document-text" size={26} color="#E31E24" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-black tracking-tight text-slate-900">
                      {item.title}
                    </p>
                    <div className="mt-1 flex items-center">
                      <Icon name="time-outline" size={14} color="#64748B" />
                      <span className="ml-1 mr-3 text-xs font-bold text-slate-500">
                        {item.durationMinutes || '0'} Mins
                      </span>
                      <Icon name="help-circle-outline" size={14} color="#64748B" />
                      <span className="ml-1 text-xs font-bold text-slate-500">
                        {item.totalMcqs} Questions
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-900 px-4 py-2.5">
                    <Icon name="play" size={16} color="white" />
                  </div>
                </Pressable>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const SectionHeader = ({ title }) => (
  <div className="flex items-center">
    <div className="mr-2 h-4 w-1 rounded-full bg-academyRed" />
    <p className="text-[11px] font-black uppercase tracking-tighter text-slate-900">{title}</p>
  </div>
)
