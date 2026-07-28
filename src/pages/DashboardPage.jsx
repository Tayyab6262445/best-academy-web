import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetAttendanceQuery, useGetProfileQuery } from '../api/authApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'

const BARS = [30, 60, 45, 100, 70, 85, 95]

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
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Spinner size="large" color="#E31E24" />
        <p className="mt-4 text-[10px] font-medium uppercase tracking-widest text-slate-400">
          Syncing Academy Data
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 pb-10">
        {/* Header */}
        <div className="mt-4 mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Best Academy" className="mr-4 h-14 w-14 object-contain" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[1px] text-slate-400">
                {greeting}
              </p>
              <p className="text-xl font-black tracking-tight text-slate-900">
                {profile?.firstName || 'Student'}
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl bg-slate-900 p-3 shadow-md">
            <Icon name="notifications-outline" size={20} color="white" />
            <span className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-academyRed" />
          </div>
        </div>

        {/* Attendance Card */}
        <div className="relative mb-8 overflow-hidden rounded-[40px] bg-slate-900 p-7 shadow-2xl shadow-slate-400">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />

          <div className="mb-8 flex items-start justify-between">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                Current Attendance
              </p>
              <p className="text-4xl font-black text-white">
                {attendance?.summary?.attendanceRate || '0%'}
              </p>
            </div>
            <div className="rounded-xl bg-academyRed px-3 py-1.5">
              <p className="text-[9px] font-black uppercase tracking-tighter text-white">
                Academic Year {new Date().getFullYear().toString().slice(-2)}
              </p>
            </div>
          </div>

          <div className="mb-8 flex h-16 items-end justify-between px-1">
            {BARS.map((height, i) => (
              <div key={i} className="flex items-center">
                <div
                  style={{ height: `${height}%` }}
                  className={`w-1.5 rounded-full ${i === 6 ? 'bg-academyRed' : 'bg-white/10'}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-between border-t border-white/5 pt-6">
            <StatBox label="Present" value={attendance?.summary?.present} dotColor="bg-green-500" />
            <StatBox label="Absent" value={attendance?.summary?.absent} dotColor="bg-red-500" />
            <StatBox label="Leaves" value={attendance?.summary?.leave} dotColor="bg-amber-500" />
          </div>
        </div>

        {/* Quick actions */}
        <SectionTitle title="Portal Services" />
        <div className="mb-4 grid grid-cols-2 gap-x-4 lg:grid-cols-4">
          <ActionButton
            title="Attempted Quiz"
            icon="analytics-outline"
            color="bg-indigo-600"
            onClick={() => navigate('/attempted-tests')}
            subText="Grade Card"
          />
          <ActionButton
            title="Quiz Result"
            icon="calendar-clear-outline"
            color="bg-emerald-600"
            onClick={() => navigate('/quiz-result')}
            subText="Result Logs"
          />
          <ActionButton
            title="Courses"
            icon="library-outline"
            color="bg-amber-600"
            onClick={() => navigate('/courses')}
            subText="Study Material"
          />
          <ActionButton
            title="Profile"
            icon="finger-print-outline"
            color="bg-slate-800"
            onClick={() => navigate('/profile')}
            subText="Bio Data"
          />
        </div>

        {/* Notice board */}
        <SectionTitle title="Academy Notice Board" />
        <Pressable
          onClick={() => navigate('/results')}
          className="mb-12 flex w-full items-center rounded-[35px] border border-slate-100 bg-white p-6 text-left shadow-sm"
        >
          <div className="rounded-2xl bg-red-50 p-4">
            <Icon name="megaphone" size={24} color="#E31E24" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-base font-bold text-slate-900">New Result Published</p>
            <p className="text-xs font-medium text-slate-400">MDCAT Mock Test Round 1 is live.</p>
          </div>
          <div className="rounded-full bg-slate-50 p-2">
            <Icon name="chevron-forward" size={18} color="#64748b" />
          </div>
        </Pressable>
      </div>
    </div>
  )
}

const SectionTitle = ({ title }) => (
  <div className="mb-5 ml-1 flex items-center">
    <div className="mr-2 h-1.5 w-1.5 rounded-full bg-academyRed" />
    <p className="text-[11px] font-black uppercase tracking-[1.5px] text-slate-900">{title}</p>
  </div>
)

const StatBox = ({ label, value, dotColor }) => (
  <div className="flex items-center">
    <div className={`mr-2 h-1.5 w-1.5 rounded-full ${dotColor}`} />
    <div>
      <p className="text-sm font-black text-white">{value || 0}</p>
      <p className="text-[8px] font-bold uppercase tracking-tighter text-white/30">{label}</p>
    </div>
  </div>
)

const ActionButton = ({ title, icon, color, onClick, subText }) => (
  <Pressable
    onClick={onClick}
    className="mb-6 rounded-[35px] border border-slate-100 bg-white p-6 text-left shadow-sm shadow-slate-200"
  >
    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-[18px] ${color} shadow-lg`}>
      <Icon name={icon} size={22} color="white" />
    </div>
    <p className="text-[15px] font-black tracking-tight text-slate-900">{title}</p>
    <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">{subText}</p>
  </Pressable>
)
