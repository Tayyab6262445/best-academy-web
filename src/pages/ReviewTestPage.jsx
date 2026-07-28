import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useReviewTestQuery } from '../api/attemptApi'
import Icon from '../components/Icon'
import Button from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'

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
      <div className="flex flex-col items-center justify-center px-10 py-24 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <Icon name="alert-circle-outline" size={28} className="text-red-600" />
        </div>
        <p className="text-lg font-semibold text-slate-900">Missing test ID</p>
        <Button className="mt-6" onClick={() => navigate(-1)}>
          Go back
        </Button>
      </div>
    )
  }

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Review Test</h2>
        <p className="text-sm text-slate-500">Detailed analysis of your attempt</p>
      </div>

      <div className="rounded-xl bg-slate-900 p-6 shadow-card">
        <p className="mb-1 text-base font-semibold text-white">{reviewData?.testInfo?.title}</p>
        <p className="mb-5 text-sm text-slate-400">
          {reviewData?.testInfo?.subject} • {reviewData?.testInfo?.class}
        </p>

        <div className="flex items-center justify-between rounded-md bg-white/10 p-4">
          <div className="flex-1 border-r border-white/10 text-center">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-white/50">Total Score</p>
            <p className="text-base font-semibold text-white">
              {reviewData?.resultSummary?.obtainedMarks}/{reviewData?.resultSummary?.totalMarks}
            </p>
          </div>
          <div className="flex-1 text-center">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-white/50">Accuracy</p>
            <p className="text-base font-semibold text-white">{reviewData?.resultSummary?.percentage}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {(reviewData?.mcqs || []).map((item) => (
          <Card key={item.questionId} className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-md bg-slate-100 px-3 py-1">
                <span className="text-xs font-semibold text-slate-900">Question {item.questionNumber}</span>
              </div>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  item.isCorrect ? 'bg-green-100' : 'bg-red-100'
                }`}
              >
                <Icon name={item.isCorrect ? 'checkmark' : 'close'} size={16} className={item.isCorrect ? 'text-green-700' : 'text-red-700'} />
              </div>
            </div>

            <p className="mb-5 text-sm font-semibold leading-6 text-slate-900">{item.questionText}</p>

            <div className="flex flex-col gap-2.5">
              {Object.entries(item.options).map(([key, value]) => {
                const isCorrectOption = key === item.correctOption
                const isSelectedOption = key === item.selectedOption
                const isWrongSelection = isSelectedOption && !item.isCorrect

                let borderColor = 'border-slate-200'
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
                    className={`flex items-center justify-between rounded-md border p-3.5 ${bgColor} ${borderColor}`}
                  >
                    <span className={`flex-1 text-sm font-medium ${textColor}`}>
                      {key}. {value}
                    </span>
                    {isCorrectOption && <Icon name="checkmark-circle" size={18} className="text-green-700" />}
                    {isWrongSelection && <Icon name="close-circle" size={18} className="text-red-700" />}
                  </div>
                )
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
