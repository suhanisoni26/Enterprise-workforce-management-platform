import { useMemo, useState } from 'react';
import { HiOutlineOfficeBuilding, HiOutlinePlus, HiOutlineUsers } from 'react-icons/hi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/Filters';
import { EmptyState } from '../../components/ui/States';

const DEPARTMENTS = [
  { id: 1, name: 'Engineering', head: 'Amara Okafor', count: 62, color: '#3B82F6' },
  { id: 2, name: 'Design', head: 'Grace Miller', count: 18, color: '#8B5CF6' },
  { id: 3, name: 'People Ops', head: 'Priya Nair', count: 9, color: '#10B981' },
  { id: 4, name: 'Finance', head: 'Daniel Kim', count: 12, color: '#F59E0B' },
  { id: 5, name: 'IT', head: 'Ivan Petrov', count: 21, color: '#22D3EE' },
  { id: 6, name: 'Compliance', head: 'Lucia Fernandez', count: 6, color: '#F87171' },
  { id: 7, name: 'Sales', head: 'Omar Hassan', count: 34, color: '#A78BFA' },
  { id: 8, name: 'Support', head: 'Tom Baker', count: 27, color: '#34D399' },
];

const DepartmentsPage = () => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () => DEPARTMENTS.filter((d) => d.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">Org Structure</p>
          <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
            Departments
          </h1>
          <p className="text-[#64748B] text-xs mt-1.5">{DEPARTMENTS.length} departments · {DEPARTMENTS.reduce((s, d) => s + d.count, 0)} employees</p>
        </div>
        <Button variant="primary" icon={HiOutlinePlus}>Add Department</Button>
      </div>

      <SearchInput value={search} onChange={setSearch} placeholder="Search departments..." className="max-w-sm" />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={HiOutlineOfficeBuilding} title="No departments found" description="Try a different search term, or add a new department." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((dept) => (
            <Card key={dept.id} hover className="cursor-pointer">
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${dept.color}1F` }}>
                  <HiOutlineOfficeBuilding className="w-5 h-5" style={{ color: dept.color }} />
                </div>
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#64748B] uppercase tracking-wider">
                  <HiOutlineUsers className="w-3.5 h-3.5" /> {dept.count}
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#F8FAFC]">{dept.name}</h3>
              <p className="text-[11px] text-[#64748B] mt-1">Led by {dept.head}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
