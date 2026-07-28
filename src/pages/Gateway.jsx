import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'

// Mirrors app/index.tsx — an auth gateway that immediately routes to the
// dashboard or the login screen. The RN app's old marketing HomePage.js is
// dead code (not wired into any active route) and is intentionally not
// resurrected here — see TICKETS.md TICKET-04.
export default function Gateway() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const navigate = useNavigate()

  useEffect(() => {
    navigate(isAuthenticated ? '/dashboard' : '/login', { replace: true })
  }, [isAuthenticated, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <Spinner size="large" color="#E31E24" />
    </div>
  )
}
