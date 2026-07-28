import { useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Button from '../components/ui/button'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-10 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
        <Icon name="compass-outline" size={26} className="text-slate-400" />
      </div>
      <h1 className="text-xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-1.5 text-sm text-slate-500">The page you're looking for doesn't exist.</p>
      <Button className="mt-6" onClick={() => navigate('/')}>
        Go home
      </Button>
    </div>
  )
}
