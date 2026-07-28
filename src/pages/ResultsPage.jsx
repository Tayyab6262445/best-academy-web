import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useViewResultsMutation } from '../api/authApi'
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'

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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner size="large" color="#E31E24" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 mt-6 flex items-end justify-between">
          <img src={logo} alt="Best Academy" className="h-14 w-14 object-contain" />
          <div className="text-right">
            <p className="text-3xl font-black tracking-tighter text-slate-900">Performance</p>
            <p className="italic font-medium text-slate-500">Academic Transcript 2026</p>
          </div>
          <div className="rounded-2xl bg-academyRed/10 p-2">
            <Icon name="analytics" size={24} color="#E31E24" />
          </div>
        </div>

        <div className="mb-8 flex items-center rounded-[30px] bg-slate-900 p-5 shadow-lg shadow-slate-300">
          <div className="mr-4 rounded-2xl bg-white/10 p-3">
            <Icon name="person" size={20} color="white" />
          </div>
          <div>
            <p className="text-lg font-bold leading-tight text-white">{user?.name}</p>
            <p className="text-xs uppercase tracking-widest text-slate-400">{data?.header?.class}</p>
          </div>
        </div>

        {data?.tests && Object.keys(data.tests).length > 0 ? (
          Object.entries(data.tests).map(([roundName, subjects]) => (
            <TestRoundCard key={roundName} roundName={roundName} subjects={subjects} />
          ))
        ) : (
          <EmptyState />
        )}

        <div className="h-10" />
      </div>
    </div>
  )
}

const TestRoundCard = ({ roundName, subjects }) => {
  const totalObtained = subjects.reduce((acc, curr) => acc + curr.obtainedMarks, 0)
  const totalMax = subjects.reduce((acc, curr) => acc + curr.totalMarks, 0)
  const avgPercent = ((totalObtained / totalMax) * 100).toFixed(1)

  return (
    <div className="mb-6 rounded-[35px] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <span className="text-xs font-black text-slate-900">{roundName}</span>
          </div>
          <p className="text-xl font-black tracking-tight text-slate-900">Round Report</p>
        </div>
        <div className="rounded-full border border-green-100 bg-green-50 px-3 py-1">
          <span className="text-xs font-bold text-green-600">{avgPercent}% Avg</span>
        </div>
      </div>

      {subjects.map((sub, index) => (
        <div key={index} className="mb-5">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {sub.subject}
              </p>
              <p className="text-sm font-bold text-slate-900">
                Marks: {sub.obtainedMarks}/{sub.totalMarks}
              </p>
            </div>
            <p className="text-sm font-black text-slate-900">{sub.percentage.toFixed(0)}%</p>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
  )
}

const EmptyState = () => (
  <div className="mt-20 flex flex-col items-center justify-center">
    <div className="mb-6 rounded-full bg-slate-100 p-8">
      <Icon name="document-text-outline" size={50} color="#cbd5e1" />
    </div>
    <p className="text-lg font-bold text-slate-900">No Results Released</p>
    <p className="mt-2 px-10 text-center text-slate-400">
      Your academic results will appear here once they are published by the academy.
    </p>
  </div>
)
