import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useGetAttendanceQuery } from '../api/authApi'
import Icon from '../components/Icon'
import Button from '../components/ui/button'
import StatCard from '../components/StatCard'
import EmptyState from '../components/EmptyState'
import { Skeleton } from '../components/ui/skeleton'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'
import dayjs from 'dayjs'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const STATUSES = ['', 'Present', 'Absent', 'Leave']

const STATUS_VARIANT = { Present: 'success', Absent: 'danger', Leave: 'warning' }

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

  const records = data?.records || []

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Attendance History</h2>
          <p className="text-sm text-slate-500">{data?.student?.class || 'Current session'}</p>
        </div>
        <Button variant="outline" onClick={exportToPDF}>
          <Icon name="share-outline" size={16} />
          Share PDF
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="stats-chart" tone="brand" label="Attendance Rate" value={data?.summary?.attendanceRate || '0%'} />
        <StatCard icon="checkmark-circle" tone="success" label="Present" value={data?.summary?.present ?? 0} />
        <StatCard icon="close-circle" tone="danger" label="Absent" value={data?.summary?.absent ?? 0} />
        <StatCard icon="time-outline" tone="warning" label="Leave" value={data?.summary?.leave ?? 0} />
      </div>

      {/* Filters — desktop: Select + Tabs, mobile: horizontal chips */}
      <div className="hidden items-center justify-between sm:flex">
        <Tabs value={selectedStatus || 'all'} onValueChange={(v) => setSelectedStatus(v === 'all' ? '' : v)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Present">Present</TabsTrigger>
            <TabsTrigger value="Absent">Absent</TabsTrigger>
            <TabsTrigger value="Leave">Leave</TabsTrigger>
          </TabsList>
        </Tabs>

        <Select value={String(selectedMonth)} onValueChange={(v) => setSelectedMonth(Number(v))}>
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m, i) => (
              <SelectItem key={m} value={String(i + 1)}>
                {m} 2026
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 sm:hidden">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              onClick={() => setSelectedMonth(i + 1)}
              className={`shrink-0 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                selectedMonth === i + 1
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-200 bg-white text-slate-500'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="flex rounded-md bg-slate-100 p-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`flex-1 rounded-sm py-2 text-xs font-semibold transition-colors ${
                selectedStatus === s ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
            >
              {s === '' ? 'ALL' : s.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Records */}
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <EmptyState icon="calendar-outline" title="No records found" description="No attendance records for this period." />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Session</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium text-slate-900">
                      {dayjs(item.date).format('ddd, DD MMM YYYY')}
                    </TableCell>
                    <TableCell className="text-slate-500">Morning Session</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[item.status] || 'neutral'}>{item.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card list */}
          <div className="flex flex-col gap-2 md:hidden">
            {records.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">{dayjs(item.date).format('ddd, DD MMM YYYY')}</p>
                  <p className="text-xs text-slate-400">Morning Session</p>
                </div>
                <Badge variant={STATUS_VARIANT[item.status] || 'neutral'}>{item.status}</Badge>
              </div>
            ))}
          </div>

          <div ref={sentinelRef} className="h-1" />
          {isFetching && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
