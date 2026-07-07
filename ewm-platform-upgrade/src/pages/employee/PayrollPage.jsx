import { useEffect, useState } from 'react';
import { HiOutlineCurrencyDollar, HiOutlineDownload, HiOutlineDocumentText, HiOutlineTrendingUp } from 'react-icons/hi';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Badge from '../../components/ui/Badge';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/States';
import toast from 'react-hot-toast';

const MOCK_PAYSLIPS = [
  { id: 1, month: 'June 2026', gross: 6800, net: 5624, status: 'paid' },
  { id: 2, month: 'May 2026', gross: 6800, net: 5624, status: 'paid' },
  { id: 3, month: 'April 2026', gross: 6800, net: 5590, status: 'paid' },
  { id: 4, month: 'March 2026', gross: 6500, net: 5380, status: 'paid' },
];

const PayrollPage = () => {
  const [status, setStatus] = useState('loading');
  const [payslips, setPayslips] = useState([]);

  const load = async () => {
    setStatus('loading');
    try {
      await new Promise((r) => setTimeout(r, 550));
      setPayslips(MOCK_PAYSLIPS);
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => { load(); }, []);

  const columns = [
    { key: 'month', header: 'Pay Period' },
    { key: 'gross', header: 'Gross Pay', render: (r) => `$${r.gross.toLocaleString()}` },
    { key: 'net', header: 'Net Pay', render: (r) => `$${r.net.toLocaleString()}` },
    { key: 'status', header: 'Status', render: (r) => <Badge variant="success" dot>{r.status}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <button
          onClick={() => toast.success(`Downloading payslip — ${r.month}`)}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3B82F6] hover:text-[#60A5FA] transition-colors"
        >
          <HiOutlineDownload className="w-3.5 h-3.5" /> PDF
        </button>
      ),
    },
  ];

  const ytdNet = payslips.reduce((s, p) => s + p.net, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">Compensation</p>
        <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>Payroll</h1>
        <p className="text-[#64748B] text-xs mt-1.5">View and download your payslips.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard label="Latest Net Pay" value={payslips[0] ? `$${payslips[0].net.toLocaleString()}` : '—'} icon={HiOutlineCurrencyDollar} accent="#10B981" loading={status === 'loading'} />
        <StatCard label="Year to Date" value={`$${ytdNet.toLocaleString()}`} icon={HiOutlineTrendingUp} accent="#3B82F6" loading={status === 'loading'} />
        <StatCard label="Payslips on File" value={payslips.length} icon={HiOutlineDocumentText} accent="#8B5CF6" loading={status === 'loading'} />
      </div>

      <Card padded={false}>
        <div className="p-5 border-b" style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
          <h3 className="text-sm font-semibold text-[#F8FAFC]">Payslip History</h3>
        </div>
        {status === 'loading' && <TableSkeleton rows={4} cols={5} />}
        {status === 'error' && <ErrorState onRetry={load} />}
        {status === 'success' && payslips.length === 0 && (
          <EmptyState icon={HiOutlineCurrencyDollar} title="No payslips yet" description="Your payslips will appear here once payroll has been processed." />
        )}
        {status === 'success' && payslips.length > 0 && <Table columns={columns} rows={payslips} />}
      </Card>
    </div>
  );
};

export default PayrollPage;
