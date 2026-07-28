import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetAttendanceQuery } from '../api/authApi'
import Icon from '../components/Icon'
import Pressable from '../components/Pressable'
import Spinner from '../components/Spinner'
import logo from '../assets/logo.png'
import dayjs from 'dayjs'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const getStatusColor = (status) => {
  switch (status) {
    case 'Present':
      return 'bg-green-500'
    case 'Absent':
      return 'bg-red-500'
    case 'Leave':
      return 'bg-amber-500'
    default:
      return 'bg-slate-400'
  }
}

export default function AttendancePage() {
  const user = useSelector(selectCurrentUser)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [page, setPage] = useState(1)
  const sentinelRef = useRef(null)

  const { data, isLoading, isFetching } = useGetAttendanceQuery({
    studentId: user?.studentId,
    month: selectedMonth,
    year: 2026,
    status: selectedStatus,
    page,
    limit: 20,
  })

  useEffect(() => {
    setPage(1)
  }, [selectedMonth, selectedStatus])

  // Replaces FlatList's onEndReached for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && data?.pagination?.hasNext && !isFetching) {
          setPage((p) => p + 1)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [data?.pagination?.hasNext, isFetching])

  // Replaces expo-print + expo-sharing: builds the same HTML report and
  // opens the browser's print dialog so the student can save it as a PDF.
  const exportToPDF = () => {
    const htmlContent = `
      <html>
        <head>
          <title>Best Academy Attendance Report</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #E31E24; padding-bottom: 10px; }
            .student-info { margin-top: 20px; display: flex; justify-content: space-between; }
            .summary { margin-top: 20px; display: flex; justify-content: space-around; background: #f8fafc; padding: 15px; border-radius: 10px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th { background-color: #0F172A; color: white; padding: 12px; text-align: left; }
            td { border-bottom: 1px solid #e2e8f0; padding: 12px; }
            .Present { color: #10b981; font-weight: bold; }
            .Absent { color: #ef4444; font-weight: bold; }
            .Leave { color: #f59e0b; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Best Academy Attendance Report</h1>
            <p>Generated on ${dayjs().format('DD MMM YYYY')}</p>
          </div>
          <div class="student-info">
            <div>
              <p><b>Name:</b> ${data?.student?.name}</p>
              <p><b>Roll Number:</b> ${data?.student?.rollNumber}</p>
            </div>
            <div>
              <p><b>Period:</b> ${MONTHS[selectedMonth - 1]} 2026</p>
              <p><b>Status:</b> ${selectedStatus || 'All'}</p>
            </div>
          </div>
          <div class="summary">
            <div><b>Present:</b> ${data?.summary?.present}</div>
            <div><b>Absent:</b> ${data?.summary?.absent}</div>
            <div><b>Leave:</b> ${data?.summary?.leave}</div>
            <div><b>Rate:</b> ${data?.summary?.attendanceRate}</div>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              ${(data?.records || [])
                .map(
                  (record) => `
                <tr>
                  <td>${dayjs(record.date).format('ddd, DD MMM YYYY')}</td>
                  <td class="${record.status}">${record.status}</td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (!printWindow) return
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => printWindow.print()
  }

  return (
    <div className="min-h-screen bg-white px-5">
      <div className="mx-auto max-w-3xl">
        {/* Page Header */}
        <div className="mb-5 mt-2 flex items-center justify-between">
          <img src={logo} alt="Best Academy" className="h-14 w-14 object-contain" />
          <p className="ml-2 text-2xl font-bold text-slate-900">Attendance History</p>
          <Pressable
            onClick={exportToPDF}
            className="flex items-center rounded-2xl bg-slate-900 px-4 py-2.5 shadow-sm shadow-slate-400"
          >
            <Icon name="share-outline" size={18} color="#fff" />
            <span className="ml-2 text-xs font-bold text-white">Share PDF</span>
          </Pressable>
        </div>

        {/* Student Card */}
        <div className="mb-6 rounded-[32px] bg-slate-900 p-6 shadow-xl shadow-slate-900/20">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="mb-2 inline-block rounded-md bg-academyRed/20 px-2 py-0.5">
                <span className="text-[10px] font-bold uppercase tracking-tighter text-academyRed">
                  Verified Student
                </span>
              </div>
              <p className="text-2xl font-bold leading-tight text-white">{user?.name}</p>
              <p className="mt-0.5 text-sm text-slate-400">{data?.student?.class}</p>
              <div className="mt-3 flex items-center">
                <Icon name="barcode-outline" size={14} color="#64748b" />
                <span className="ml-1 font-mono text-xs uppercase text-slate-500">
                  {data?.student?.rollNumber}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-[6px] border-slate-800">
                <div
                  className="absolute h-20 w-20 rounded-full border-[6px] border-academyRed"
                  style={{
                    borderBottomColor: 'transparent',
                    borderLeftColor: 'transparent',
                    transform: 'rotate(45deg)',
                  }}
                />
                <span className="text-lg font-black text-white">
                  {Math.floor(parseFloat(data?.summary?.attendanceRate) || 0)}%
                </span>
              </div>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Rate
              </p>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="mb-8 flex justify-between">
          <div className="w-[30%] items-center rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-center">
            <p className="text-lg font-bold text-green-600">{data?.summary?.present}</p>
            <p className="text-[10px] font-bold uppercase text-green-600/60">Present</p>
          </div>
          <div className="w-[30%] items-center rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-center">
            <p className="text-lg font-bold text-red-600">{data?.summary?.absent}</p>
            <p className="text-[10px] font-bold uppercase text-red-600/60">Absent</p>
          </div>
          <div className="w-[30%] items-center rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-center">
            <p className="text-lg font-bold text-amber-600">{data?.summary?.leave}</p>
            <p className="text-[10px] font-bold uppercase text-amber-600/60">Leave</p>
          </div>
        </div>

        {/* Controls */}
        <div className="mb-2 flex items-end justify-between">
          <p className="text-lg font-bold text-slate-900">Filter History</p>
          <p className="mb-1 text-[10px] font-bold uppercase text-slate-400">2026</p>
        </div>

        <div className="no-scrollbar mb-5 flex gap-3 overflow-x-auto py-1">
          {MONTHS.map((m, i) => (
            <Pressable
              key={m}
              onClick={() => setSelectedMonth(i + 1)}
              className={`shrink-0 rounded-2xl border px-6 py-2.5 ${
                selectedMonth === i + 1
                  ? 'border-slate-900 bg-slate-900 shadow-md shadow-slate-400'
                  : 'border-slate-100 bg-white'
              }`}
            >
              <span className={`font-bold ${selectedMonth === i + 1 ? 'text-white' : 'text-slate-400'}`}>
                {m}
              </span>
            </Pressable>
          ))}
        </div>

        <div className="mb-4 flex rounded-[22px] bg-slate-100 p-1.5">
          {['', 'Present', 'Absent', 'Leave'].map((s) => (
            <Pressable
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`flex-1 rounded-[18px] py-3 ${selectedStatus === s ? 'bg-white shadow-sm' : ''}`}
            >
              <span
                className={`block text-center text-[10px] font-black ${
                  selectedStatus === s ? 'text-slate-900' : 'text-slate-400'
                }`}
              >
                {s === '' ? 'ALL' : s.toUpperCase()}
              </span>
            </Pressable>
          ))}
        </div>

        {/* Records */}
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Spinner size="large" color="#E31E24" />
          </div>
        ) : (data?.records || []).length === 0 ? (
          <div className="mt-10 flex flex-col items-center">
            <Icon name="calendar-outline" size={60} color="#CBD5E1" />
            <p className="mt-4 text-slate-400">No records found for this period.</p>
          </div>
        ) : (
          <div className="pb-10">
            {data.records.map((item) => (
              <div
                key={item._id}
                className="mb-3 flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
              >
                <div>
                  <p className="font-bold text-slate-900">{dayjs(item.date).format('ddd, DD MMM YYYY')}</p>
                  <p className="text-xs text-slate-400">Morning Session</p>
                </div>
                <div className={`rounded-full px-4 py-1 ${getStatusColor(item.status)}`}>
                  <span className="text-xs font-bold text-white">{item.status}</span>
                </div>
              </div>
            ))}
            <div ref={sentinelRef} className="h-4" />
            {isFetching && (
              <div className="flex justify-center py-4">
                <Spinner size="large" color="#E31E24" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
