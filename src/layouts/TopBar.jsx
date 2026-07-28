import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import { useGetProfileQuery } from '../api/authApi'
import Icon from '../components/Icon'
import Button from '../components/ui/button'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip'

const PAGE_META = {
  '/dashboard': { title: 'Dashboard' },
  '/attendance': { title: 'Attendance' },
  '/results': { title: 'Results' },
  '/quizzes': { title: 'Quizzes' },
  '/profile': { title: 'Profile', back: true },
  '/courses': { title: 'Courses' },
  '/attempted-tests': { title: 'Attempted Tests', back: true },
  '/quiz-result': { title: 'Quiz Results', back: true },
  '/review-test': { title: 'Review Test', back: true },
}

export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const { data: profile } = useGetProfileQuery(user?.studentId, { skip: !user?.studentId })

  const meta = PAGE_META[location.pathname] || { title: 'Best Academy' }
  const initials = `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() || 'S'

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        {meta.back && (
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
            <Icon name="chevron-back" size={18} />
          </Button>
        )}
        <h1 className="text-[15px] font-semibold text-slate-900">{meta.title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => navigate('/courses')}
              aria-label="Courses"
            >
              <Icon name="library-outline" size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Courses</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Icon name="notifications-outline" size={18} />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-academyRed" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-academyRed/40">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {profile?.firstName || 'Student'}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              {profile?.firstName} {profile?.lastName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <Icon name="person" size={16} />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem destructive onSelect={(e) => e.preventDefault()}>
                  <Icon name="log-out-outline" size={16} />
                  Log out
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out of Best Academy?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You'll need to sign in again with your roll number and password to access your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleLogout}>
                    Log out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
