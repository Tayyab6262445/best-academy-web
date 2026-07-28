import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetTestByIdQuery, useSubmitTestMutation } from '../api/attemptApi'
import Icon from '../components/Icon'
import Button from '../components/ui/button'
import { Card } from '../components/ui/card'
import { Skeleton } from '../components/ui/skeleton'
import { toast } from '../components/ui/use-toast'
import { cn } from '../lib/cn'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog'
import { Dialog, DialogContent } from '../components/ui/dialog'

export default function TestAttemptPage() {
  const [searchParams] = useSearchParams()
  const testId = searchParams.get('testId')
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  const { data: testData, isLoading: isFetching } = useGetTestByIdQuery(testId, { skip: !testId })
  const [submitTest, { isLoading: isSubmitting }] = useSubmitTestMutation()

  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [testResult, setTestResult] = useState(null)

  const handleSelect = (questionId, option) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const answeredCount = Object.keys(selectedAnswers).length

  const handleRequestSubmit = () => {
    if (answeredCount === 0) {
      toast({ variant: 'destructive', title: 'Wait!', description: 'Please answer at least one question before submitting.' })
      return
    }
    setConfirmOpen(true)
  }

  const performSubmit = async () => {
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
      toast({ variant: 'destructive', title: 'Error', description: error?.data?.message || 'Failed to submit test' })
    }
  }

  if (isFetching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50">
        <div className="w-full max-w-2xl px-5">
          <Skeleton className="h-6 w-40" />
          <div className="mt-5 flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const test = testData?.data

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Close">
          <Icon name="close" size={20} />
        </Button>
        <h1 className="mx-2.5 flex-1 truncate text-center text-sm font-semibold text-slate-900">{test?.title}</h1>
        <div className="w-9" />
      </div>

      <div className="mx-auto max-w-2xl p-5 pb-12">
        {test?.mcqs.map((mcq, index) => (
          <Card key={mcq._id} className="mb-4 p-5">
            <p className="mb-4 text-sm font-semibold leading-6 text-slate-900">
              <span className="text-academyRed">Q{index + 1}.</span> {mcq.questionText}
            </p>

            <div className="flex flex-col gap-2">
              {Object.entries(mcq.options).map(([key, value]) => {
                const isSelected = selectedAnswers[mcq._id] === key
                return (
                  <button
                    key={key}
                    onClick={() => handleSelect(mcq._id, key)}
                    className={cn(
                      'flex w-full items-center rounded-md border p-3 text-left transition-colors',
                      isSelected ? 'border-academyRed bg-red-50' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    )}
                  >
                    <span
                      className={cn(
                        'mr-3 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border-2',
                        isSelected ? 'border-academyRed' : 'border-slate-300'
                      )}
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-academyRed" />}
                    </span>
                    <span className={cn('flex-1 text-sm', isSelected ? 'font-semibold text-academyRed' : 'text-slate-600')}>
                      {value}
                    </span>
                  </button>
                )
              })}
            </div>
          </Card>
        ))}

        <Button size="lg" className="mt-2 w-full" disabled={isSubmitting} onClick={handleRequestSubmit}>
          {isSubmitting ? 'Submitting…' : 'Finish and submit'}
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm submission</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} question{answeredCount === 1 ? '' : 's'}. Do you want to submit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={performSubmit}>Submit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={showResult}
        onOpenChange={(open) => {
          setShowResult(open)
          if (!open) navigate('/quizzes', { replace: true })
        }}
      >
        <DialogContent showClose={false} className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <Icon name="checkmark-circle" size={36} className="text-green-500" />
          </div>

          <h2 className="text-xl font-semibold text-slate-900">Test submitted!</h2>

          <div className="flex w-full justify-around">
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">Score</p>
              <p className="text-base font-semibold text-slate-900">
                {testResult?.obtainedMarks} / {testResult?.totalMarks}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">Correct</p>
              <p className="text-base font-semibold text-green-600">{testResult?.correctAnswers}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium uppercase text-slate-500">Wrong</p>
              <p className="text-base font-semibold text-academyRed">{testResult?.wrongAnswers}</p>
            </div>
          </div>

          <div className="mx-auto inline-block rounded-full bg-slate-100 px-5 py-2">
            <span className="text-lg font-semibold text-academyRed">{testResult?.percentage}%</span>
          </div>

          <Button
            className="w-full"
            onClick={() => {
              setShowResult(false)
              navigate('/quizzes', { replace: true })
            }}
          >
            Back to quizzes
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
