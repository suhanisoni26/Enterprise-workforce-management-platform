import { useEffect, useState } from 'react';
import { HiOutlineCalendar, HiOutlineCheckCircle, HiOutlineXCircle, HiOutlineClock } from 'react-icons/hi';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/States';

const MOCK_ATTENDANCE = [
  { id: 1, date: '2026-06-30', checkIn: '09:02 AM', checkOut: '06:14 PM', hours: '9h 12m', status: 'present' },
  { id: 2, date: '2026-06-29', checkIn: '09:11 AM', checkOut: '06:02 PM', hours: '8h 51m', status: 'present' },
  { id: 3, date: '2026-06-28', checkIn: '—', checkOut: '—', hours: '—', status: 'absent' },
  { id: 4, date: '2026-06-27', checkIn: '09:45 AM', checkOut: '06:20 PM', hours: '8h 35m', status: 'late' },
  { id: 5, date: '2026-06-26', checkIn: '08:58 AM', checkOut: '06:05 PM', hours: '9h 07m', status: 'present' },
  { id: 6, date: '2026-06-25', checkIn: '09:03 AM', checkOut: '06:11 PM', hours: '9h 08m', status: 'present' },
];

const statusVariant = { present: 'success', absent: 'danger', late: 'warning' };

const AttendancePage = () => {
  const [status, setStatus] = useState('loading');
  const [records, setRecords] = useState([]);

  const load = async () => {
    setStatus('loading');
    try {
      await new Promise((r) => setTimeout(r, 550));
      setRecords(MOCK_ATTENDANCE);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) },
    { key: 'checkIn', header: 'Check In' },
    { key: 'checkOut', header: 'Check Out' },
    { key: 'hours', header: 'Hours Logged' },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusVariant[r.status]} dot>{r.status}</Badge> },
  ];

  const presentCount = records.filter((r) => r.status === 'present').length;
  const lateCount = records.filter((r) => r.status === 'late').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">This Month</p>
        <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>Attendance</h1>
        <p className="text-[#64748B] text-xs mt-1.5">Track your check-ins, hours, and attendance history.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Present Days" value={presentCount} icon={HiOutlineCheckCircle} accent="#10B981" loading={status === 'loading'} />
        <StatCard label="Late Arrivals" value={lateCount} icon={HiOutlineClock} accent="#F59E0B" loading={status === 'loading'} />
        <StatCard label="Absences" value={absentCount} icon={HiOutlineXCircle} accent="#EF4444" loading={status === 'loading'} />
      </div>

      <Card padded={false}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Recent History</h3>
        </div>

        {status === 'loading' && <TableSkeleton rows={5} cols={5} />}
        {status === 'error' && <ErrorState onRetry={load} />}
        {status === 'success' && records.length === 0 && (
          <EmptyState icon={HiOutlineCalendar} title="No attendance records yet" description="Your check-in history will appear here once available." />
        )}
        {status === 'success' && records.length > 0 && <Table columns={columns} rows={records} />}
      </Card>
    </div>
  );
};

export default AttendancePage;
