import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetSectionsByClassQuery, useGetPublishedTestsMutation } from '../api/attemptApi'
import Icon from '../components/Icon'
import Button from '../components/ui/button'
import { Skeleton } from '../components/ui/skeleton'
import EmptyState from '../components/EmptyState'
import SectionHeader from '../components/SectionHeader'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

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
  const subjects = subjectData?.data || []

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Online Tests</h2>
        <p className="text-sm text-slate-500">Select a subject to view available assessments.</p>
      </div>

      {/* Subject selector — desktop: Tabs, mobile: horizontal chips */}
      <div className="hidden md:block">
        <Tabs value={selectedSubjectId ?? ''} onValueChange={setSelectedSubjectId}>
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
          const isSelected = selectedSubjectId === item._id
          return (
            <button
              key={item._id}
              onClick={() => setSelectedSubjectId(item._id)}
              className={`shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              {item.name}
            </button>
          )
        })}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <SectionHeader title="Available Assessments" />
          {tests?.length > 0 && <span className="text-xs font-medium text-slate-400">{tests.length} found</span>}
        </div>

        {isTestsLoading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : !tests || tests.length === 0 ? (
          <EmptyState
            icon="search-outline"
            title="No tests found"
            description="Select a subject above to view available assessments for your class."
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tests.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell className="font-medium text-slate-900">{item.title}</TableCell>
                      <TableCell className="text-slate-500">{item.durationMinutes || 0} mins</TableCell>
                      <TableCell className="text-slate-500">{item.totalMcqs} questions</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => navigate(`/test-attempt?testId=${item._id}`)}>
                          <Icon name="play" size={14} />
                          Start
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile card list */}
            <div className="flex flex-col gap-3 md:hidden">
              {tests.map((item) => (
                <button
                  key={item._id}
                  onClick={() => navigate(`/test-attempt?testId=${item._id}`)}
                  className="flex w-full items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left transition-colors hover:border-slate-300"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-red-50">
                    <Icon name="document-text" size={20} className="text-academyRed" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Icon name="time-outline" size={13} />
                        {item.durationMinutes || 0} mins
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="help-circle-outline" size={13} />
                        {item.totalMcqs} questions
                      </span>
                    </div>
                  </div>
                  <Icon name="chevron-forward" size={16} className="shrink-0 text-slate-400" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
