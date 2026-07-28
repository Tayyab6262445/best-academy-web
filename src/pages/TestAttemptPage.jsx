import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetTestByIdQuery, useSubmitTestMutation } from '../api/attemptApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import { useAlert } from '../components/AlertProvider'

export default function TestAttemptPage() {
  const [searchParams] = useSearchParams()
  const testId = searchParams.get('testId')
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)
  const { alert, confirm } = useAlert()

  const { data: testData, isLoading: isFetching } = useGetTestByIdQuery(testId, { skip: !testId })
  const [submitTest, { isLoading: isSubmitting }] = useSubmitTestMutation()

  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const handleFinalSubmit = async () => {
    const answeredCount = Object.keys(selectedAnswers).length
    if (answeredCount === 0) {
      await alert('Wait!', 'Please answer at least one question before submitting.')
      return
    }

    const confirmed = await confirm(
      'Confirm Submission',
      `You have answered ${answeredCount} questions. Do you want to submit?`,
      { confirmText: 'Submit' }
    )
    if (!confirmed) return

    const formattedAnswers = Object.entries(selectedAnswers).map(([qId, opt]) => ({
      questionId: qId,
      selectedOption: opt,
    }))

    const submissionBody = {
      studentId: user?.studentId,
      rollNumber: user?.rollNumber,
      answers: formattedAnswers,
      sectionId: user?.section,
    }

    try {
      const response = await submitTest({ testId, submissionData: submissionBody }).unwrap()
      setTestResult(response.result)
      setShowResult(true)
    } catch (error) {
      await alert('Error', error?.data?.message || 'Failed to submit test')
    }
  }

  if (isFetching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC]">
        <Spinner size="large" color="#E31E24" />
        <p className="mt-2.5 text-slate-500">Loading Test...</p>
      </div>
    )
  }

  const test = testData?.data

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-5">
        <Pressable onClick={() => navigate(-1)}>
          <Icon name="close" size={28} color="#0F172A" />
        </Pressable>
        <h1 className="mx-2.5 flex-1 truncate text-center text-lg font-extrabold text-[#0F172A]">
          {test?.title}
        </h1>
        <div className="w-7" />
      </div>

      <div className="mx-auto max-w-2xl p-5 pb-12">
        {test?.mcqs.map((mcq, index) => (
          <div key={mcq._id} className="mb-5 rounded-[20px] bg-white p-5 shadow-sm">
            <p className="mb-5 text-base font-bold leading-6 text-[#1E293B]">
              <span className="text-academyRed">Q{index + 1}.</span> {mcq.questionText}
            </p>

            {Object.entries(mcq.options).map(([key, value]) => {
              const isSelected = selectedAnswers[mcq._id] === key
              return (
                <Pressable
                  key={key}
                  onClick={() => handleSelect(mcq._id, key)}
                  className={`mb-2.5 flex w-full items-center rounded-xl border-[1.5px] p-[15px] text-left ${
                    isSelected ? 'border-academyRed bg-red-50' : 'border-slate-100 bg-[#F8FAFC]'
                  }`}
                >
                  <span
                    className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      isSelected ? 'border-academyRed' : 'border-slate-300'
                    }`}
                  >
                    {isSelected && <span className="h-2.5 w-2.5 rounded-full bg-academyRed" />}
                  </span>
                  <span
                    className={`flex-1 text-[15px] font-medium ${
                      isSelected ? 'font-bold text-academyRed' : 'text-slate-600'
                    }`}
                  >
                    {value}
                  </span>
                </Pressable>
              )
            })}
          </div>
        ))}

        <Pressable
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="mt-2.5 flex w-full items-center justify-center rounded-[18px] bg-academyRed py-5"
        >
          {isSubmitting ? (
            <Spinner size="small" color="#fff" />
          ) : (
            <span className="text-base font-black tracking-widest text-white">FINISH AND SUBMIT</span>
          )}
        </Pressable>
      </div>

      {/* Result modal */}
      {showResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,23,42,0.8)] p-5">
          <div className="w-full max-w-sm rounded-[30px] bg-white p-[30px] text-center">
            <div className="mb-5">
              <Icon name="checkmark-circle" size={80} color="#22C55E" />
            </div>

            <h2 className="mb-[25px] text-2xl font-black text-[#0F172A]">Test Submitted!</h2>

            <div className="mb-[30px] flex w-full justify-around">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Score</p>
                <p className="text-lg font-extrabold text-[#0F172A]">
                  {testResult?.obtainedMarks} / {testResult?.totalMarks}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Correct</p>
                <p className="text-lg font-extrabold text-[#22C55E]">{testResult?.correctAnswers}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Wrong</p>
                <p className="text-lg font-extrabold text-academyRed">{testResult?.wrongAnswers}</p>
              </div>
            </div>

            <div className="mb-[30px] inline-block rounded-full bg-[#F1F5F9] px-[25px] py-2.5">
              <span className="text-xl font-black text-academyRed">{testResult?.percentage}%</span>
            </div>

            <Pressable
              onClick={() => {
                setShowResult(false)
                navigate('/quizzes', { replace: true })
              }}
              className="w-full rounded-2xl bg-[#0F172A] py-[15px]"
            >
              <span className="text-base font-bold text-white">Back to Dashboard</span>
            </Pressable>
          </div>
        </div>
      )}
    </div>
  )
}
