import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetAttendanceQuery, useGetProfileQuery } from '../api/authApi'
import Icon from '../components/Icon'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import SectionHeader from '../components/SectionHeader'

const BARS = [30, 60, 45, 100, 70, 85, 95]

const ACTIONS = [
  { title: 'Attempted Quiz', subText: 'Grade Card', icon: 'analytics-outline', color: 'bg-indigo-600', to: '/attempted-tests' },
  { title: 'Quiz Result', subText: 'Result Logs', icon: 'calendar-clear-outline', color: 'bg-emerald-600', to: '/quiz-result' },
  { title: 'Courses', subText: 'Study Material', icon: 'library-outline', color: 'bg-amber-600', to: '/courses' },
  { title: 'Profile', subText: 'Bio Data', icon: 'finger-print-outline', color: 'bg-slate-800', to: '/profile' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery(user?.studentId)
  const { data: attendance, isLoading: isAttendanceLoading } = useGetAttendanceQuery({
    studentId: user?.studentId,
  })

  const isLoading = isProfileLoading || isAttendanceLoading

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-56 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
        <Skeleton className="h-56 w-full rounded-lg" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {greeting}, {profile?.firstName || 'Student'}
          </p>
          <h2 className="mt-0.5 text-xl font-semibold text-slate-900">Here's your academy snapshot</h2>
        </div>

        {/* Attendance hero */}
        <div className="relative overflow-hidden rounded-xl bg-slate-900 p-6 shadow-card">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />

          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-white/50">Current Attendance</p>
              <p className="text-3xl font-semibold text-white">{attendance?.summary?.attendanceRate || '0%'}</p>
            </div>
            <div className="rounded-md bg-academyRed px-2.5 py-1">
              <p className="text-[11px] font-semibold text-white">
                AY {new Date().getFullYear().toString().slice(-2)}
              </p>
            </div>
          </div>

          <div className="mb-6 flex h-16 items-end justify-between px-1">
            {BARS.map((height, i) => (
              <div
                key={i}
                style={{ height: `${height}%` }}
                className={`w-1.5 rounded-full ${i === 6 ? 'bg-academyRed' : 'bg-white/10'}`}
              />
            ))}
          </div>

          <div className="flex justify-between border-t border-white/10 pt-5">
            <StatBox label="Present" value={attendance?.summary?.present} dotColor="bg-green-500" />
            <StatBox label="Absent" value={attendance?.summary?.absent} dotColor="bg-red-500" />
            <StatBox label="Leaves" value={attendance?.summary?.leave} dotColor="bg-amber-500" />
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <SectionHeader title="Portal Services" className="mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {ACTIONS.map((action) => (
              <ActionCard key={action.to} {...action} onClick={() => navigate(action.to)} />
            ))}
          </div>
        </div>
      </div>

      {/* Right rail */}
      <div>
        <SectionHeader title="Notice Board" className="mb-4" />
        <button
          onClick={() => navigate('/results')}
          className="flex w-full items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-card transition-colors hover:border-slate-300"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50">
            <Icon name="megaphone" size={18} className="text-academyRed" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">New Result Published</p>
            <p className="mt-0.5 text-xs text-slate-500">MDCAT Mock Test Round 1 is live.</p>
          </div>
          <Icon name="chevron-forward" size={16} className="mt-1 shrink-0 text-slate-400" />
        </button>
      </div>
    </div>
  )
}

const StatBox = ({ label, value, dotColor }) => (
  <div className="flex items-center gap-2">
    <div className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
    <div>
      <p className="text-sm font-semibold text-white">{value || 0}</p>
      <p className="text-[11px] text-white/40">{label}</p>
    </div>
  </div>
)

const ActionCard = ({ title, icon, color, subText, onClick }) => (
  <Card
    as="button"
    onClick={onClick}
    className="flex flex-col items-start p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-popover"
  >
    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md ${color}`}>
      <Icon name={icon} size={18} className="text-white" />
    </div>
    <p className="text-sm font-semibold text-slate-900">{title}</p>
    <p className="mt-0.5 text-xs text-slate-500">{subText}</p>
  </Card>
)
