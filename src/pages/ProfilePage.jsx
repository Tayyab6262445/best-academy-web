import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import { useGetProfileQuery } from '../api/authApi'
import Icon from '../components/Icon'
import { Card } from '../components/ui/card'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Skeleton } from '../components/ui/skeleton'
import SectionHeader from '../components/SectionHeader'
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
import Button from '../components/ui/button'
import dayjs from 'dayjs'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(selectCurrentUser)

  const { data: profile, isLoading } = useGetProfileQuery(user?.studentId, {
    skip: !user?.studentId,
  })

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-lg" />
      </div>
    )
  }

  const initials = `${profile?.firstName?.[0] || ''}${profile?.lastName?.[0] || ''}`.toUpperCase() || 'S'

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Summary */}
      <Card className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-lg font-semibold text-slate-900">
              {profile?.firstName} {profile?.lastName}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
                {profile?.rollNumber}
              </span>
              <span className="text-xs text-slate-400">{profile?.registrationType}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-8">
          <HeroStat label="Class" value={profile?.sectionName || 'N/A'} icon="school" />
          <HeroStat label="Shift" value={profile?.shift} icon="time" />
          <HeroStat label="Gender" value={profile?.gender} icon="person" />
        </div>
      </Card>

      {/* Content */}
      <div className="flex flex-col gap-4">
        <SectionHeader title="Academic Journey" />
        <Card className="p-5">
          <DetailRow label="Program" value={profile?.class?.name} icon="ribbon-outline" />
          <DetailRow
            label="Admission"
            value={profile?.admissionDate ? dayjs(profile.admissionDate).format('DD MMM, YYYY') : null}
            icon="calendar-outline"
          />
          <DetailRow label="Previous School" value={profile?.previousSchool} icon="business-outline" />
          <DetailRow label="City/Area" value={profile?.city || profile?.area || 'Not Set'} icon="location-outline" last />
        </Card>
      </div>

      <div className="flex flex-col gap-4">
        <SectionHeader title="Emergency & Contact" />
        <Card className="p-5">
          <DetailRow label="Parent Name" value={profile?.parentName} icon="people-outline" />
          <DetailRow label="Parent Contact" value={profile?.parentContact} icon="call-outline" />
          <DetailRow label="WhatsApp" value={profile?.whatsappNumber} icon="logo-whatsapp" last />
        </Card>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
            <Icon name="power" size={16} />
            Terminate session
          </Button>
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
    </div>
  )
}

const HeroStat = ({ label, value, icon }) => (
  <div className="flex flex-col items-center rounded-md bg-slate-50 p-3 text-center">
    <Icon name={icon} size={16} className="text-academyRed" />
    <p className="mt-1 truncate text-xs font-semibold text-slate-900">{value || '—'}</p>
    <p className="text-[10px] font-medium uppercase text-slate-400">{label}</p>
  </div>
)

const DetailRow = ({ label, value, icon, last }) => (
  <div className={`flex items-center py-3 ${!last ? 'border-b border-slate-100' : ''}`}>
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white">
      <Icon name={icon} size={15} className="text-slate-500" />
    </div>
    <div className="ml-3.5 flex-1">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-slate-900">{value || 'Not Provided'}</p>
    </div>
  </div>
)
