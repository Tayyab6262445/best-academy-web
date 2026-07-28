import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useReviewTestQuery } from '../api/attemptApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'

export default function ReviewTestPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const user = useSelector(selectCurrentUser)

  const testId = searchParams.get('testId')
  const studentId = searchParams.get('studentId') || user?.studentId || user?._id

  const { data, isLoading, isFetching } = useReviewTestQuery(
    { testId, studentId },
    { skip: !testId || !studentId }
  )

  const reviewData = data?.data

  if (!testId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-10 text-center">
        <div className="mb-6 rounded-full bg-red-100 p-6">
          <Icon name="alert-circle-outline" size={50} color="#DC2626" />
        </div>
        <p className="text-xl font-black text-slate-900">Missing Test ID</p>
        <Pressable
          onClick={() => navigate(-1)}
          className="mt-6 w-full rounded-2xl bg-slate-900 px-8 py-4"
        >
          <span className="block text-center font-black uppercase tracking-widest text-white">
            Go Back
          </span>
        </Pressable>
      </div>
    )
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Spinner size="large" color="#E31E24" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8 mt-6 flex items-end justify-between">
          <img src={logo} alt="Best Academy" className="h-12 w-12 object-contain" />
          <div className="text-center">
            <p className="text-3xl font-black tracking-tighter text-slate-900">Review</p>
            <p className="italic font-medium text-slate-500">Detailed Analysis</p>
          </div>
          <Pressable
            onClick={() => navigate(-1)}
            className="rounded-full bg-slate-50 p-2"
          >
            <Icon name="school" size={20} color="#64748b" />
          </Pressable>
        </div>

        <div className="mb-8 rounded-[35px] bg-slate-900 p-6 shadow-xl shadow-slate-300">
          <p className="mb-1 text-xl font-black tracking-tight text-white">
            {reviewData?.testInfo?.title}
          </p>
          <p className="mb-6 italic font-medium text-slate-400">
            {reviewData?.testInfo?.subject} • {reviewData?.testInfo?.class}
          </p>

          <div className="flex items-center justify-between rounded-[25px] bg-white/10 p-5">
            <div className="flex-1 border-r border-white/10 text-center">
              <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Total Score
              </p>
              <p className="text-lg font-black text-white">
                {reviewData?.resultSummary?.obtainedMarks}/{reviewData?.resultSummary?.totalMarks}
              </p>
            </div>
            <div className="flex-1 text-center">
              <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                Accuracy
              </p>
              <p className="text-lg font-black text-white">{reviewData?.resultSummary?.percentage}%</p>
            </div>
          </div>
        </div>

        <div className="pb-10">
          {(reviewData?.mcqs || []).map((item) => (
            <div
              key={item.questionId}
              className="mb-6 rounded-[35px] border border-slate-100 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-full bg-slate-100 px-4 py-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">
                    Question {item.questionNumber}
                  </span>
                </div>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    item.isCorrect ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  <Icon
                    name={item.isCorrect ? 'checkmark' : 'close'}
                    size={18}
                    color={item.isCorrect ? '#059669' : '#DC2626'}
                  />
                </div>
              </div>

              <p className="mb-6 text-lg font-bold leading-6 tracking-tight text-slate-900">
                {item.questionText}
              </p>

              <div className="space-y-3">
                {Object.entries(item.options).map(([key, value]) => {
                  const isCorrectOption = key === item.correctOption
                  const isSelectedOption = key === item.selectedOption
                  const isWrongSelection = isSelectedOption && !item.isCorrect

                  let borderColor = 'border-slate-100'
                  let bgColor = 'bg-slate-50'
                  let textColor = 'text-slate-600'

                  if (isCorrectOption) {
                    borderColor = 'border-green-500'
                    bgColor = 'bg-green-50'
                    textColor = 'text-green-700'
                  } else if (isWrongSelection) {
                    borderColor = 'border-red-500'
                    bgColor = 'bg-red-50'
                    textColor = 'text-red-700'
                  }

                  return (
                    <div
                      key={key}
                      className={`mb-2 flex items-center justify-between rounded-2xl border-2 p-4 ${bgColor} ${borderColor}`}
                    >
                      <span className={`flex-1 text-sm font-bold ${textColor}`}>
                        {key}. {value}
                      </span>
                      {isCorrectOption && <Icon name="checkmark-circle" size={20} color="#15803D" />}
                      {isWrongSelection && <Icon name="close-circle" size={20} color="#DC2626" />}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
