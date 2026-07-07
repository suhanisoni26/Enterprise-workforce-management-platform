/**
 * Employee Management Page
 * Wire `loadEmployees()` below to your real endpoint (e.g. authService.getEmployees
 * or a dedicated employeeService.list) — it currently uses representative mock data
 * so the page is fully functional out of the box.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineUserAdd, HiOutlineDotsVertical, HiOutlineUsers, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Table from '../../components/ui/Table';
import Pagination from '../../components/ui/Pagination';
import { SearchInput, SelectFilter } from '../../components/ui/Filters';
import { EmptyState, ErrorState, TableSkeleton } from '../../components/ui/States';
import { roleLabels } from '../../lib/theme';

const PAGE_SIZE = 8;

const MOCK_EMPLOYEES = [
  { id: 'EMP-1001', firstName: 'Sarah', lastName: 'Chen', email: 'sarah.chen@ewm.edu', phone: '+1 415 555 0142', role: 'MANAGER', department: 'Engineering', status: 'active', joiningDate: '2023-02-14' },
  { id: 'EMP-1002', firstName: 'Marcus', lastName: 'Webb', email: 'marcus.webb@ewm.edu', phone: '+1 415 555 0198', role: 'EMPLOYEE', department: 'Design', status: 'active', joiningDate: '2024-06-01' },
  { id: 'EMP-1003', firstName: 'Priya', lastName: 'Nair', email: 'priya.nair@ewm.edu', phone: '+1 415 555 0177', role: 'HR_MANAGER', department: 'People Ops', status: 'active', joiningDate: '2022-11-20' },
  { id: 'EMP-1004', firstName: 'Daniel', lastName: 'Kim', email: 'daniel.kim@ewm.edu', phone: '+1 415 555 0133', role: 'FINANCE', department: 'Finance', status: 'on_leave', joiningDate: '2021-09-09' },
  { id: 'EMP-1005', firstName: 'Amara', lastName: 'Okafor', email: 'amara.okafor@ewm.edu', phone: '+1 415 555 0165', role: 'TEAM_LEAD', department: 'Engineering', status: 'active', joiningDate: '2023-08-30' },
  { id: 'EMP-1006', firstName: 'Ivan', lastName: 'Petrov', email: 'ivan.petrov@ewm.edu', phone: '+1 415 555 0119', role: 'IT_ADMIN', department: 'IT', status: 'active', joiningDate: '2020-04-17' },
  { id: 'EMP-1007', firstName: 'Lucia', lastName: 'Fernandez', email: 'lucia.fernandez@ewm.edu', phone: '+1 415 555 0154', role: 'AUDITOR', department: 'Compliance', status: 'inactive', joiningDate: '2019-12-02' },
  { id: 'EMP-1008', firstName: 'Tom', lastName: 'Baker', email: 'tom.baker@ewm.edu', phone: '+1 415 555 0121', role: 'EMPLOYEE', department: 'Support', status: 'active', joiningDate: '2024-01-11' },
  { id: 'EMP-1009', firstName: 'Yuki', lastName: 'Tanaka', email: 'yuki.tanaka@ewm.edu', phone: '+1 415 555 0187', role: 'ORG_ADMIN', department: 'Leadership', status: 'active', joiningDate: '2018-07-23' },
  { id: 'EMP-1010', firstName: 'Grace', lastName: 'Miller', email: 'grace.miller@ewm.edu', phone: '+1 415 555 0141', role: 'EMPLOYEE', department: 'Design', status: 'on_leave', joiningDate: '2024-03-19' },
  { id: 'EMP-1011', firstName: 'Omar', lastName: 'Hassan', email: 'omar.hassan@ewm.edu', phone: '+1 415 555 0106', role: 'MANAGER', department: 'Sales', status: 'active', joiningDate: '2022-05-05' },
  { id: 'EMP-1012', firstName: 'Elena', lastName: 'Volkov', email: 'elena.volkov@ewm.edu', phone: '+1 415 555 0189', role: 'EMPLOYEE', department: 'Engineering', status: 'active', joiningDate: '2023-10-14' },
];

const statusVariant = { active: 'success', on_leave: 'warning', inactive: 'neutral' };
const statusLabel = { active: 'Active', on_leave: 'On Leave', inactive: 'Inactive' };

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const loadEmployees = async () => {
    setStatus('loading');
    try {
      // Replace with: const { data } = await authService.getEmployees();
      await new Promise((resolve) => setTimeout(resolve, 650));
      setEmployees(MOCK_EMPLOYEES);
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch =
        !search ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.id.toLowerCase().includes(search.toLowerCase());
      const matchesRole = !roleFilter || e.role === roleFilter;
      const matchesStatus = !statusFilter || e.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [employees, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => setPage(1), [search, roleFilter, statusFilter]);

  const columns = [
    {
      key: 'name',
      header: 'Employee',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            {row.firstName[0]}
            {row.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#F8FAFC] truncate">{row.firstName} {row.lastName}</p>
            <p className="text-[10px] text-[#64748B] truncate">{row.id}</p>
          </div>
        </div>
      ),
      width: '22%',
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (row) => (
        <div className="space-y-0.5">
          <p className="flex items-center gap-1.5 text-[11px]"><HiOutlineMail className="w-3 h-3 text-[#64748B]" /> {row.email}</p>
          <p className="flex items-center gap-1.5 text-[11px] text-[#64748B]"><HiOutlinePhone className="w-3 h-3" /> {row.phone}</p>
        </div>
      ),
    },
    { key: 'department', header: 'Department' },
    {
      key: 'role',
      header: 'Role',
      render: (row) => <Badge variant="info">{roleLabels[row.role] || row.role}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <Badge variant={statusVariant[row.status]} dot>{statusLabel[row.status]}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      render: () => (
        <button className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-colors">
          <HiOutlineDotsVertical className="w-4 h-4" />
        </button>
      ),
      width: '48px',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">Directory</p>
          <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
            Employees
          </h1>
          <p className="text-[#64748B] text-xs mt-1.5">{filtered.length} of {employees.length} team members</p>
        </div>
        <Button variant="primary" icon={HiOutlineUserAdd} onClick={() => navigate('/admin/create-employee')}>
          Create Employee
        </Button>
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-5 border-b" style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by name, email, or ID..." className="flex-1" />
          <div className="flex gap-3">
            <SelectFilter
              value={roleFilter}
              onChange={setRoleFilter}
              placeholder="All roles"
              options={Object.entries(roleLabels).map(([value, label]) => ({ value, label }))}
            />
            <SelectFilter
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All statuses"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'on_leave', label: 'On Leave' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </div>
        </div>

        {status === 'loading' && <TableSkeleton rows={6} cols={6} />}

        {status === 'error' && <ErrorState onRetry={loadEmployees} />}

        {status === 'success' && filtered.length === 0 && (
          <EmptyState
            icon={HiOutlineUsers}
            title="No employees match your filters"
            description="Try adjusting your search or filters, or create a new employee."
            action={
              <Button variant="secondary" size="sm" onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); }}>
                Clear filters
              </Button>
            }
          />
        )}

        {status === 'success' && filtered.length > 0 && (
          <>
            <Table columns={columns} rows={pageRows} />
            <Pagination page={page} totalPages={totalPages} totalItems={filtered.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  );
};

export default EmployeesPage;
