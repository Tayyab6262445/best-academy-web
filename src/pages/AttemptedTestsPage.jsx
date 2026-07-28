import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetAttemptedTestsQuery } from '../api/attemptApi'
import Icon from '../components/Icon'
import Button from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import EmptyState from '../components/EmptyState'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

export default function AttemptedTestsPage() {
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const studentId = user?.studentId || user?._id || user?.id

  const { data, isLoading, isFetching, refetch } = useGetAttemptedTestsQuery(studentId, {
    skip: !studentId,
  })

  if (!user && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center px-10 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Icon name="lock-closed-outline" size={28} className="text-slate-400" />
        </div>
        <p className="text-lg font-semibold text-slate-900">Session expired</p>
        <p className="mb-6 mt-1 text-sm text-slate-500">Please log in again to view your history.</p>
        <Button onClick={() => navigate('/login')}>Go to login</Button>
      </div>
    )
  }

  const attempts = data?.data

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Attempted Tests</h2>
          <p className="text-sm text-slate-500">Your quiz attempt history</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={refetch} aria-label="Refresh">
              <Icon name={isFetching ? 'sync-circle' : 'refresh'} size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : !attempts || attempts.length === 0 ? (
        <EmptyState icon="file-tray-outline" title="No history found" description="You haven't attempted any tests yet." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Test</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attempts.map((item) => {
                  const isPassing = item.percentage >= 50
                  return (
                    <TableRow key={item._id}>
                      <TableCell>
                        <p className="font-medium text-slate-900">{item.testId?.title || 'Untitled Test'}</p>
                        <p className="text-xs text-slate-400">
                          {item.subjectId?.name} • {item.classId?.name}
                        </p>
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {item.obtainedMarks}/{item.totalMarks} ({item.percentage}%)
                      </TableCell>
                      <TableCell>
                        <Badge variant={isPassing ? 'success' : 'danger'}>{isPassing ? 'Passed' : 'Failed'}</Badge>
                      </TableCell>
                      <TableCell className="text-slate-500">{new Date(item.submittedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/review-test?testId=${item.testId?._id}&studentId=${studentId}`)}
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col gap-4 md:hidden">
            {attempts.map((item) => {
              const isPassing = item.percentage >= 50
              return (
                <Card key={item._id} className="p-5">
                  <div className="mb-4 flex items-start justify-between gap-2">
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100">
                        <Icon name="document-text" size={18} className="text-academyRed" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {item.testId?.title || 'Untitled Test'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.subjectId?.name} • {item.classId?.name}
                        </p>
                      </div>
                    </div>
                    <Badge variant={isPassing ? 'success' : 'danger'}>{item.percentage}%</Badge>
                  </div>

                  <div className="mb-4 grid grid-cols-3 divide-x divide-slate-200 rounded-md border border-slate-200 bg-slate-50 p-3 text-center">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Obtained</p>
                      <p className="text-sm font-semibold text-slate-900">{item.obtainedMarks}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Total</p>
                      <p className="text-sm font-semibold text-slate-900">{item.totalMarks}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Status</p>
                      <p className={`text-sm font-semibold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                        {isPassing ? 'Passed' : 'Failed'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">{new Date(item.submittedAt).toLocaleDateString()}</span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/review-test?testId=${item.testId?._id}&studentId=${studentId}`)}
                    >
                      Review
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
