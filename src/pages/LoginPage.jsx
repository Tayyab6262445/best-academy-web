import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from '../features/auth/authSlice'
import { useLoginStudentMutation } from '../api/authApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import { useAlert } from '../components/AlertProvider'

export default function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { alert } = useAlert()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [secureText, setSecureText] = useState(true)

  const [loginStudent, { isLoading }] = useLoginStudentMutation()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (isLoading) return

    if (!identifier || !password) {
      await alert('Required', 'Please enter your credentials to continue.')
      return
    }

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
      await alert('Authentication Failed', errorMessage)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#020617]">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)' }}
      />
      <div className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rounded-full bg-[rgba(227,30,36,0.05)]" />

      <div className="relative flex min-h-screen flex-col justify-center px-7 py-12 safe-top safe-bottom">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-9">
            <Pressable
              onClick={() => navigate(-1)}
              className="mb-5 -ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white/5"
            >
              <Icon name="arrow-back" size={24} color="#E31E24" />
            </Pressable>
            <h1 className="text-[34px] font-extrabold tracking-tight text-white">Welcome Back</h1>
            <p className="mt-2 text-base text-slate-400 opacity-80">
              Sign in to your student portal to continue
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="rounded-[32px] border border-white/[0.08] bg-white/[0.03] p-7"
          >
            <div>
              <label className="mb-2.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Roll Number
              </label>
              <div className="flex h-[60px] items-center rounded-2xl border border-white/5 bg-black/20 px-4">
                <Icon name="id-card-outline" size={20} color="#64748B" />
                <span className="ml-3 mr-1 font-bold text-academyRed">BAM -</span>
                <input
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                  placeholder="XXX or YYY"
                  disabled={isLoading}
                  autoCapitalize="characters"
                  className="ml-1 min-w-0 flex-1 bg-transparent text-base text-white placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="flex h-[60px] items-center rounded-2xl border border-white/5 bg-black/20 px-4">
                <Icon name="lock-closed-outline" size={20} color="#64748B" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={secureText ? 'password' : 'text'}
                  inputMode="numeric"
                  disabled={isLoading}
                  className="ml-3 min-w-0 flex-1 bg-transparent text-base text-white placeholder-slate-600 outline-none"
                />
                <Pressable
                  type="button"
                  onClick={() => setSecureText((s) => !s)}
                  className="p-1"
                >
                  <Icon name={secureText ? 'eye-off' : 'eye'} size={20} color="#94A3B8" />
                </Pressable>
              </div>
            </div>

            <Pressable
              type="submit"
              disabled={isLoading}
              className="mt-8 w-full overflow-hidden rounded-[18px]"
              activeOpacity={0.85}
            >
              <div
                className="flex items-center justify-center py-5"
                style={{
                  background: isLoading
                    ? 'linear-gradient(90deg, #334155, #1E293B)'
                    : 'linear-gradient(90deg, #E31E24, #9F1239)',
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2.5 text-sm font-extrabold tracking-[1.5px] text-white">
                    <Spinner size="small" color="#fff" />
                    AUTHENTICATING...
                  </span>
                ) : (
                  <span className="text-sm font-extrabold tracking-[1.5px] text-white">SIGN IN</span>
                )}
              </div>
            </Pressable>
          </form>

          <Pressable
            onClick={() =>
              alert(
                'Portal Support',
                "If you've forgotten your credentials, please contact the IT Administration office."
              )
            }
            className="mx-auto mt-9 block"
          >
            <span className="text-sm text-slate-400">
              Having trouble? <span className="font-extrabold text-academyRed">Contact Admin</span>
            </span>
          </Pressable>
        </div>
      </div>
    </div>
  )
}
