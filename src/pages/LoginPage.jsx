import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useLoginStudentMutation } from '../api/authApi'
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'
import Button from '../components/ui/button'
import { FormField, Input } from '../components/ui/input'
import { toast } from '../components/ui/use-toast'
import logo from '../assets/logo.png'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [secureText, setSecureText] = useState(true)
  const [fieldError, setFieldError] = useState('')

  const [loginStudent, { isLoading }] = useLoginStudentMutation()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (isLoading) return

    if (!identifier || !password) {
      setFieldError('Please enter your roll number and password to continue.')
      return
    }
    setFieldError('')

    const formattedRollNumber = `BAM-${identifier.trim()}`

    try {
      const payload = {
        roll: formattedRollNumber,
        password: password.trim(),
      }

      const response = await loginStudent(payload).unwrap()

      if (response && response.success) {
        const dataToStore = response.data || response
        dispatch(setCredentials(dataToStore))
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      const errorMessage =
        error?.data?.message || error?.message || 'An unexpected connection error occurred. Please try again.'
      toast({ variant: 'destructive', title: 'Authentication failed', description: errorMessage })
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Brand panel — desktop only */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: 'linear-gradient(160deg, #E31E24 0%, #7f1116 100%)' }}
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-black/10" />

        <div className="relative flex items-center gap-3">
          <img src={logo} alt="Best Academy" className="h-10 w-10 rounded-lg bg-white/90 object-contain p-1" />
          <span className="text-lg font-semibold text-white">Best Academy</span>
        </div>

        <div className="relative">
          <h2 className="text-3xl font-semibold leading-tight text-white">
            Your academic year,
            <br />
            all in one place.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Track attendance, results, quizzes, and course material from a single student portal.
          </p>
        </div>

        <p className="relative text-xs text-white/50">© {new Date().getFullYear()} Best Academy. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={logo} alt="Best Academy" className="h-9 w-9 object-contain" />
            <span className="text-base font-semibold text-slate-900">Best Academy</span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to your student portal to continue.</p>

          <form onSubmit={handleLogin} className="mt-8 flex flex-col gap-5">
            <FormField label="Roll Number" htmlFor="rollNumber">
              <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white pl-3 pr-3 transition-colors focus-within:border-academyRed/50 focus-within:ring-2 focus-within:ring-academyRed/40">
                <Icon name="id-card-outline" size={16} className="shrink-0 text-slate-400" />
                <span className="ml-2 mr-1 text-sm font-semibold text-academyRed">BAM-</span>
                <input
                  id="rollNumber"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                  placeholder="XXX or YYY"
                  disabled={isLoading}
                  autoCapitalize="characters"
                  className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
              </div>
            </FormField>

            <FormField label="Password" htmlFor="password" error={fieldError}>
              <div className="flex h-10 items-center rounded-md border border-slate-200 bg-white pl-3 pr-2 transition-colors focus-within:border-academyRed/50 focus-within:ring-2 focus-within:ring-academyRed/40">
                <Icon name="lock-closed-outline" size={16} className="shrink-0 text-slate-400" />
                <input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={secureText ? 'password' : 'text'}
                  inputMode="numeric"
                  disabled={isLoading}
                  className="ml-2 min-w-0 flex-1 bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSecureText((s) => !s)}
                  className="rounded-sm p-1.5 text-slate-400 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academyRed/40"
                  aria-label={secureText ? 'Show password' : 'Hide password'}
                >
                  <Icon name={secureText ? 'eye-off' : 'eye'} size={16} />
                </button>
              </div>
            </FormField>

            <Button type="submit" size="lg" disabled={isLoading} className="mt-1 w-full">
              {isLoading ? (
                <>
                  <Spinner size="small" color="#fff" />
                  Signing in…
                </>
              ) : (
                'Sign in'
              )}
            </Button>
          </form>

          <button
            type="button"
            onClick={() =>
              toast({
                title: 'Portal support',
                description: "If you've forgotten your credentials, please contact the IT Administration office.",
              })
            }
            className="mx-auto mt-8 block text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            Having trouble? <span className="font-semibold text-academyRed">Contact Admin</span>
          </button>
        </div>
      </div>
    </div>
  )
}
