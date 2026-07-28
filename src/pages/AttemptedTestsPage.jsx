import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetAttemptedTestsQuery } from '../api/attemptApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'

export default function AttemptedTestsPage() {
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const studentId = user?.studentId || user?._id || user?.id

  const { data, isLoading, isFetching, refetch } = useGetAttemptedTestsQuery(studentId, {
    skip: !studentId,
  })

  if (!user && !isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-10 text-center">
        <div className="mb-6 rounded-full bg-slate-200/50 p-8">
          <Icon name="lock-closed-outline" size={50} color="#64748B" />
        </div>
        <p className="text-xl font-black tracking-tighter text-slate-900">Session Expired</p>
        <p className="mb-8 mt-2 italic font-medium text-slate-500">
          Please log in again to view your history.
        </p>
        <Pressable
          onClick={() => navigate('/login')}
          className="w-full rounded-[20px] bg-slate-900 py-4"
        >
          <span className="block text-center font-black uppercase tracking-widest text-white">
            Go to Login
          </span>
        </Pressable>
      </div>
    )
  }

  const attempts = data?.data

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 mt-6 flex items-end justify-between px-6">
          <img src={logo} alt="Best Academy" className="h-12 w-12 object-contain" />
          <div className="text-center">
            <p className="text-3xl font-black tracking-tighter text-slate-900">Attempted Tests</p>
            <p className="font-medium text-slate-500">History</p>
          </div>
          <div className="flex items-center gap-3">
            <Pressable
              onClick={refetch}
              className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
            >
              <Icon name={isFetching ? 'sync-circle' : 'refresh'} size={20} color="#E31E24" />
            </Pressable>
            <Pressable
              onClick={() => navigate(-1)}
              className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm"
            >
              <Icon name="school" size={20} color="#E31E24" />
            </Pressable>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spinner size="large" color="#E31E24" />
          </div>
        ) : !attempts || attempts.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center">
            <div className="mb-6 rounded-full bg-slate-100 p-8">
              <Icon name="file-tray-outline" size={50} color="#cbd5e1" />
            </div>
            <p className="text-lg font-bold text-slate-900">No history found</p>
            <p className="mt-2 px-10 text-center text-slate-400">
              You haven't attempted any tests yet.
            </p>
          </div>
        ) : (
          <div className="px-6 pb-10">
            {attempts.map((item) => {
              const isPassing = item.percentage >= 50
              return (
                <div
                  key={item._id}
                  className="mb-6 rounded-[35px] border border-slate-100 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex items-start justify-between">
                    <div className="mr-2 flex flex-1 items-center">
                      <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                        <Icon name="document-text" size={24} color="#E31E24" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-lg font-black tracking-tight text-slate-900">
                          {item.testId?.title || 'Untitled Test'}
                        </p>
                        <p className="italic text-xs font-medium text-slate-500">
                          {item.subjectId?.name} • {item.classId?.name}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`rounded-full border px-3 py-1 ${
                        isPassing ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {item.percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="mb-5 flex justify-between rounded-[25px] border border-slate-100 bg-slate-50 p-4">
                    <div className="flex-1 items-center border-r border-slate-200 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Obtained
                      </p>
                      <p className="text-base font-bold text-slate-900">{item.obtainedMarks}</p>
                    </div>
                    <div className="flex-1 items-center border-r border-slate-200 text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Total
                      </p>
                      <p className="text-base font-bold text-slate-900">{item.totalMarks}</p>
                    </div>
                    <div className="flex-1 items-center text-center">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        Status
                      </p>
                      <p className={`text-sm font-bold ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                        {isPassing ? 'PASSED' : 'FAILED'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Icon name="calendar-outline" size={14} color="#94A3B8" />
                      <span className="ml-1 text-[11px] font-medium text-slate-400">
                        {new Date(item.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <Pressable
                      onClick={() =>
                        navigate(
                          `/review-test?testId=${item.testId?._id}&studentId=${studentId}`
                        )
                      }
                      className="rounded-2xl bg-slate-900 px-6 py-3 shadow-md"
                    >
                      <span className="text-xs font-black uppercase tracking-widest text-white">
                        Review
                      </span>
                    </Pressable>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
