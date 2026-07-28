import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetStudentReportQuery } from '../api/attemptApi'
import Icon from '../components/Icon'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import EmptyState from '../components/EmptyState'

export default function QuizResultPage() {
  const user = useSelector(selectCurrentUser)
  const studentId = user?.studentId || user?._id || user?.id

  const { data, isLoading } = useGetStudentReportQuery(studentId, { skip: !studentId })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  const tests = data?.tests

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Report Card</h2>
        <p className="text-sm text-slate-500">Academic overview, session 2026</p>
      </div>

      {/* Summary */}
      <div className="rounded-xl bg-slate-900 p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/60">Global Summary</span>
          <div className="rounded-md bg-white/10 px-2.5 py-1">
            <span className="text-[11px] font-semibold text-white">Session 2026</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
          <SummaryBox label="Total Tests" value={data?.summary?.totalTests} />
          <div className="h-8 w-px bg-white/10" />
          <SummaryBox label="Avg Score" value={`${data?.summary?.averagePercentage}%`} />
          <div className="h-8 w-px bg-white/10" />
          <SummaryBox label="Highest" value={data?.summary?.highestScore} />
        </div>

        <div className="mt-5 border-t border-white/10 pt-5 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/50">Cumulative Marks</p>
          <p className="text-xl font-semibold text-white">
            {data?.summary?.obtainedMarks} <span className="text-white/40">/ {data?.summary?.totalMarks}</span>
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-900">Attempt History</h3>

      {!tests || tests.length === 0 ? (
        <EmptyState icon="bar-chart-outline" title="No quiz attempts found" />
      ) : (
        <div className="flex flex-col gap-4">
          {tests.map((item) => (
            <Card key={item.attemptId} className="p-6">
              <div className="mb-4 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900">{item.testTitle}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {item.subject} • {item.class}
                  </p>
                </div>
                <div className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1">
                  <span className="text-xs font-semibold text-slate-900">{item.percentage}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-md border border-slate-200 bg-slate-50 p-3 text-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">Marks</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.obtainedMarks}/{item.totalMarks}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-green-600">Correct</p>
                  <p className="text-sm font-semibold text-slate-900">{item.correctAnswers}</p>
                </div>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-red-600">Wrong</p>
                  <p className="text-sm font-semibold text-slate-900">{item.wrongAnswers}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-1 text-xs text-slate-400">
                <Icon name="time-outline" size={13} />
                {new Date(item.submittedAt).toLocaleDateString()}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const SummaryBox = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xl font-semibold text-white">{value}</p>
    <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-white/50">{label}</p>
  </div>
)
