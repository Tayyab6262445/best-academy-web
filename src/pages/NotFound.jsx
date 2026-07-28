import { Link } from 'react-router-dom'
import Icon from '../components/Icon'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-10 text-center">
      <div className="mb-6 rounded-full bg-slate-100 p-8">
        <Icon name="compass-outline" size={50} color="#CBD5E1" />
      </div>
      <h1 className="text-2xl font-black tracking-tight text-slate-900">Page Not Found</h1>
      <p className="mt-2 font-medium text-slate-400">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-2xl bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white"
      >
        Go Home
      </Link>
    </div>
  )
}
