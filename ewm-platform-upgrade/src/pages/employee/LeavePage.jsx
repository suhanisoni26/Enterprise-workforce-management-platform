import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineClipboardList } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Modal from '../../components/ui/Modal';
import { FormField, TextInput, SelectInput } from '../../components/ui/FormField';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/States';

const LEAVE_BALANCES = [
  { type: 'Annual Leave', used: 6, total: 20, color: '#3B82F6' },
  { type: 'Sick Leave', used: 2, total: 10, color: '#EF4444' },
  { type: 'Work From Home', used: 4, total: 12, color: '#8B5CF6' },
];

const MOCK_REQUESTS = [
  { id: 1, type: 'Annual Leave', from: '2026-07-10', to: '2026-07-12', days: 3, status: 'pending' },
  { id: 2, type: 'Sick Leave', from: '2026-06-18', to: '2026-06-18', days: 1, status: 'approved' },
  { id: 3, type: 'Work From Home', from: '2026-06-05', to: '2026-06-06', days: 2, status: 'approved' },
  { id: 4, type: 'Annual Leave', from: '2026-05-20', to: '2026-05-22', days: 3, status: 'rejected' },
];

const statusVariant = { pending: 'warning', approved: 'success', rejected: 'danger' };

const leaveSchema = z.object({
  type: z.string().min(1, 'Select a leave type'),
  from: z.string().min(1, 'Start date is required'),
  to: z.string().min(1, 'End date is required'),
  reason: z.string().min(5, 'Please add a brief reason (min 5 characters)'),
});

const LeavePage = () => {
  const [status, setStatus] = useState('loading');
  const [requests, setRequests] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(leaveSchema),
    defaultValues: { type: 'Annual Leave', from: '', to: '', reason: '' },
  });

  const load = async () => {
    setStatus('loading');
    try {
      await new Promise((r) => setTimeout(r, 550));
      setRequests(MOCK_REQUESTS);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = (data) => {
    setRequests((prev) => [
      { id: Date.now(), type: data.type, from: data.from, to: data.to, days: 1, status: 'pending' },
      ...prev,
    ]);
    toast.success('Leave request submitted for approval');
    setModalOpen(false);
    reset();
  };

  const columns = [
    { key: 'type', header: 'Type' },
    { key: 'from', header: 'From', render: (r) => new Date(r.from).toLocaleDateString() },
    { key: 'to', header: 'To', render: (r) => new Date(r.to).toLocaleDateString() },
    { key: 'days', header: 'Days' },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={statusVariant[r.status]} dot>{r.status}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">Time Off</p>
          <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>Leave Requests</h1>
          <p className="text-[#64748B] text-xs mt-1.5">Track your balances and request time off.</p>
        </div>
        <Button variant="primary" icon={HiOutlinePlus} onClick={() => setModalOpen(true)}>Apply for Leave</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {LEAVE_BALANCES.map((b) => (
          <Card key={b.type} hover>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{b.type}</span>
              <span className="text-[10px] font-bold" style={{ color: b.color }}>{b.total - b.used} left</span>
            </div>
            <div className="w-full h-2 rounded-full mb-2" style={{ backgroundColor: 'rgba(148,163,184,0.1)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${(b.used / b.total) * 100}%`, backgroundColor: b.color }} />
            </div>
            <p className="text-[10px] text-[#64748B]">{b.used} of {b.total} days used</p>
          </Card>
        ))}
      </div>

      <Card padded={false}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Request History</h3>
        </div>
        {status === 'loading' && <TableSkeleton rows={4} cols={5} />}
        {status === 'error' && <ErrorState onRetry={load} />}
        {status === 'success' && requests.length === 0 && (
          <EmptyState icon={HiOutlineClipboardList} title="No leave requests yet" description="Requests you submit will show up here." action={<Button size="sm" onClick={() => setModalOpen(true)}>Apply for Leave</Button>} />
        )}
        {status === 'success' && requests.length > 0 && <Table columns={columns} rows={requests} />}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Apply for Leave" description="Submit a new time-off request for approval.">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <FormField label="Leave Type" error={errors.type?.message}>
            <SelectInput error={errors.type} {...register('type')}>
              <option value="Annual Leave">Annual Leave</option>
              <option value="Sick Leave">Sick Leave</option>
              <option value="Work From Home">Work From Home</option>
            </SelectInput>
          </FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="From" error={errors.from?.message}>
              <TextInput type="date" error={errors.from} {...register('from')} />
            </FormField>
            <FormField label="To" error={errors.to?.message}>
              <TextInput type="date" error={errors.to} {...register('to')} />
            </FormField>
          </div>
          <FormField label="Reason" error={errors.reason?.message}>
            <TextInput placeholder="Briefly describe the reason" error={errors.reason} {...register('reason')} />
          </FormField>
          <Button type="submit" variant="primary" className="w-full">Submit Request</Button>
        </form>
      </Modal>
    </div>
  );
};

export default LeavePage;
