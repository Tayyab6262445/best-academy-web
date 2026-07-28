import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetStudentReportQuery } from '../api/attemptApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'

export default function QuizResultPage() {
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const studentId = user?.studentId || user?._id || user?.id

  const { data, isLoading } = useGetStudentReportQuery(studentId, { skip: !studentId })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner size="large" color="#E31E24" />
      </div>
    )
  }

  const tests = data?.tests

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 mt-6 flex items-end justify-between">
          <img src={logo} alt="Best Academy" className="h-14 w-14 object-contain" />
          <div className="text-center">
            <p className="text-3xl font-black tracking-tighter text-slate-900">Report Card</p>
            <p className="italic font-medium text-slate-500">Academic Overview</p>
          </div>
          <Pressable
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
          >
            <Icon name="school" size={20} color="#E31E24" />
          </Pressable>
        </div>

        {/* Summary card */}
        <div className="mb-10 rounded-[35px] bg-slate-900 p-6 shadow-xl shadow-slate-300">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-[3px] text-white">Global Summary</span>
            <div className="rounded-full bg-white/10 px-3 py-1">
              <span className="text-[10px] font-bold uppercase text-white">Session 2026</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <SummaryBox label="Total Tests" value={data?.summary?.totalTests} />
            <div className="h-8 w-[1px] bg-white/10" />
            <SummaryBox label="Avg Score" value={`${data?.summary?.averagePercentage}%`} />
            <div className="h-8 w-[1px] bg-white/10" />
            <SummaryBox label="Highest" value={data?.summary?.highestScore} />
          </div>

          <div className="mt-6 items-center border-t border-white/10 pt-5 text-center">
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Cumulative Marks
            </p>
            <p className="text-xl font-black text-white">
              {data?.summary?.obtainedMarks}{' '}
              <span className="text-white/40">/ {data?.summary?.totalMarks}</span>
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <div className="mr-3 h-6 w-1.5 rounded-full bg-academyRed" />
          <p className="text-2xl font-black tracking-tight text-slate-900">Attempt History</p>
        </div>

        {!tests || tests.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center pb-10">
            <div className="mb-4 rounded-full bg-slate-100 p-8">
              <Icon name="bar-chart-outline" size={40} color="#cbd5e1" />
            </div>
            <p className="italic font-medium text-slate-400">No quiz attempts found.</p>
          </div>
        ) : (
          <div className="pb-10">
            {tests.map((item) => (
              <div key={item.attemptId} className="mb-6 rounded-[35px] border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <p className="text-lg font-black leading-tight tracking-tight text-slate-900">
                      {item.testTitle}
                    </p>
                    <p className="mt-1 italic text-xs font-medium text-slate-500">
                      {item.subject} • {item.class}
                    </p>
                  </div>
                  <div className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1">
                    <span className="text-[10px] font-black tracking-widest text-slate-900">
                      {item.percentage}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between rounded-[25px] border border-slate-100 bg-slate-50 p-4">
                  <div className="flex-1 border-r border-slate-200 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Marks</p>
                    <p className="text-sm font-bold text-slate-900">
                      {item.obtainedMarks}/{item.totalMarks}
                    </p>
                  </div>
                  <div className="flex-1 border-r border-slate-200 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-green-600">Correct</p>
                    <p className="text-sm font-bold text-slate-900">{item.correctAnswers}</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-600">Wrong</p>
                    <p className="text-sm font-bold text-slate-900">{item.wrongAnswers}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <Icon name="time-outline" size={12} color="#94A3B8" />
                  <span className="ml-1 text-[10px] font-bold text-slate-400">
                    {new Date(item.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const SummaryBox = ({ label, value }) => (
  <div className="text-center">
    <p className="text-xl font-black text-white">{value}</p>
    <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
  </div>
)
