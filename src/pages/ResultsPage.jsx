import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useViewResultsMutation } from '../api/authApi'
import { Card } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Skeleton } from '../components/ui/skeleton'
import EmptyState from '../components/EmptyState'

export default function ResultsPage() {
  const user = useSelector(selectCurrentUser)
  const [viewResults, { data, isLoading }] = useViewResultsMutation()

  useEffect(() => {
    if (user?.rollNumber) {
      viewResults({ rollNumber: user.rollNumber, password: user.password })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-6 w-40" />
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  const hasTests = data?.tests && Object.keys(data.tests).length > 0

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Performance</h2>
        <p className="text-sm text-slate-500">{data?.header?.class || 'Academic transcript, 2026'}</p>
      </div>

      {hasTests ? (
        <div className="flex flex-col gap-5">
          {Object.entries(data.tests).map(([roundName, subjects]) => (
            <TestRoundCard key={roundName} roundName={roundName} subjects={subjects} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="document-text-outline"
          title="No results released"
          description="Your academic results will appear here once they are published by the academy."
        />
      )}
    </div>
  )
}

const TestRoundCard = ({ roundName, subjects }) => {
  const totalObtained = subjects.reduce((acc, curr) => acc + curr.obtainedMarks, 0)
  const totalMax = subjects.reduce((acc, curr) => acc + curr.totalMarks, 0)
  const avgPercent = ((totalObtained / totalMax) * 100).toFixed(1)

  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100">
            <span className="text-xs font-semibold text-slate-900">{roundName}</span>
          </div>
          <p className="text-base font-semibold text-slate-900">Round Report</p>
        </div>
        <Badge variant="success">{avgPercent}% Avg</Badge>
      </div>

      <div className="flex flex-col gap-4">
        {subjects.map((sub, index) => (
          <div key={index}>
            <div className="mb-1.5 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{sub.subject}</p>
                <p className="text-sm font-semibold text-slate-900">
                  Marks: {sub.obtainedMarks}/{sub.totalMarks}
                </p>
              </div>
              <p className="text-sm font-semibold text-slate-900">{sub.percentage.toFixed(0)}%</p>
            </div>

            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${
                  sub.percentage > 80 ? 'bg-green-500' : sub.percentage > 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${sub.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
