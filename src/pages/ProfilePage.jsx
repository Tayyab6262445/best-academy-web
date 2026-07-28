import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectCurrentUser } from '../features/auth/authSlice'
import { useGetProfileQuery } from '../api/authApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Spinner size="large" color="#E31E24" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <div className="rounded-b-[40px] bg-slate-900 px-6 pb-8 pt-4 shadow-2xl shadow-slate-400">
          <div className="mb-6 flex items-start justify-between">
            <Pressable onClick={() => navigate(-1)} className="rounded-xl bg-white/10 p-2">
              <Icon name="chevron-back" size={24} color="white" />
            </Pressable>
            <Pressable className="rounded-xl bg-white/10 p-2">
              <Icon name="settings-outline" size={24} color="white" />
            </Pressable>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-2 border-white/20 bg-academyRed shadow-lg">
                <span className="text-3xl font-black text-white">
                  {profile?.firstName?.[0]}
                  {profile?.lastName?.[0]}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 bg-green-500" />
            </div>

            <div className="ml-5 flex-1">
              <p className="text-2xl font-black tracking-tight text-white">
                {profile?.firstName} {profile?.lastName}
              </p>
              <div className="mt-1 flex items-center">
                <div className="rounded-md bg-white/20 px-2 py-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-tighter text-white/80">
                    {profile?.rollNumber}
                  </span>
                </div>
                <span className="ml-3 text-xs font-medium uppercase italic text-slate-400">
                  {profile?.registrationType}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <HeroStat label="Class" value={profile?.sectionName || 'N/A'} icon="school" />
            <HeroStat label="Shift" value={profile?.shift} icon="time" />
            <HeroStat label="Gender" value={profile?.gender} icon="person" />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 mt-8">
          <SectionHeader title="Academic Journey" />
          <div className="mb-6 rounded-[32px] border border-slate-100 bg-slate-50 p-5">
            <DetailRow label="Program" value={profile?.class?.name} icon="ribbon-outline" />
            <DetailRow
              label="Admission"
              value={profile?.admissionDate ? dayjs(profile.admissionDate).format('DD MMM, YYYY') : null}
              icon="calendar-outline"
            />
            <DetailRow label="Previous School" value={profile?.previousSchool} icon="business-outline" />
            <DetailRow
              label="City/Area"
              value={profile?.city || profile?.area || 'Not Set'}
              icon="location-outline"
              last
            />
          </div>

          <SectionHeader title="Emergency & Contact" />
          <div className="mb-10 rounded-[32px] border-2 border-slate-50 bg-white p-5">
            <DetailRow label="Parent Name" value={profile?.parentName} icon="people-outline" />
            <DetailRow label="Parent Contact" value={profile?.parentContact} icon="call-outline" />
            <DetailRow
              label="WhatsApp"
              value={profile?.whatsappNumber}
              icon="logo-whatsapp"
              last
            />
          </div>

          <Pressable
            onClick={handleLogout}
            className="mb-12 flex w-full items-center justify-center rounded-[28px] border border-red-100 bg-red-50 py-5"
          >
            <Icon name="power" size={20} color="#ef4444" />
            <span className="ml-2 text-xs font-black uppercase tracking-widest text-red-500">
              Terminate Session
            </span>
          </Pressable>
        </div>
      </div>
    </div>
  )
}

const HeroStat = ({ label, value, icon }) => (
  <div className="flex w-[30%] flex-col items-center rounded-2xl bg-white/5 p-3 text-center">
    <Icon name={icon} size={16} color="#E31E24" />
    <p className="mt-1 truncate text-[11px] font-bold text-white">{value || '—'}</p>
    <p className="text-[8px] font-black uppercase text-white/40">{label}</p>
  </div>
)

const SectionHeader = ({ title }) => (
  <div className="mb-3 flex items-center pl-1">
    <div className="mr-2 h-4 w-1 rounded-full bg-academyRed" />
    <p className="text-[11px] font-black uppercase tracking-tighter text-slate-900">{title}</p>
  </div>
)

const DetailRow = ({ label, value, icon, last }) => (
  <div className={`flex items-center py-3.5 ${!last ? 'border-b border-slate-200/50' : ''}`}>
    <div className="rounded-xl border border-slate-100 bg-white p-2 shadow-sm">
      <Icon name={icon} size={16} color="#64748b" />
    </div>
    <div className="ml-4 flex-1">
      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm font-bold text-slate-900">{value || 'Not Provided'}</p>
    </div>
  </div>
)
