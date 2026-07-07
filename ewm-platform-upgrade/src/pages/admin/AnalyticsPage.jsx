import { useState } from 'react';
import { HiOutlineUsers, HiOutlineCash, HiOutlineClock, HiOutlineTrendingUp } from 'react-icons/hi';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader } from '../../components/ui/Card';
import { SelectFilter } from '../../components/ui/Filters';

const barData = [
  { label: 'Eng', value: 62 }, { label: 'Design', value: 18 }, { label: 'Sales', value: 34 },
  { label: 'Finance', value: 12 }, { label: 'IT', value: 21 }, { label: 'Support', value: 27 },
];

const donutSegments = [
  { label: 'Full Time', value: 68, color: '#3B82F6' },
  { label: 'Contract', value: 18, color: '#8B5CF6' },
  { label: 'Part Time', value: 9, color: '#10B981' },
  { label: 'Intern', value: 5, color: '#F59E0B' },
];

const BarChart = () => {
  const max = Math.max(...barData.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-3 h-[200px] px-2">
      {barData.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2 group">
          <div className="w-full flex items-end justify-center" style={{ height: 160 }}>
            <div
              className="w-full max-w-[36px] rounded-t-md transition-all duration-500 group-hover:opacity-80"
              style={{ height: `${(d.value / max) * 100}%`, background: 'linear-gradient(180deg, #3B82F6, #2563EB)' }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-[9px] font-bold text-[#64748B] uppercase tracking-wider">{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = () => {
  const total = donutSegments.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex items-center gap-8 flex-wrap justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <g transform="rotate(-90 80 80)">
          {donutSegments.map((seg) => {
            const frac = seg.value / total;
            const dash = frac * circumference;
            const offset = (cumulative / total) * circumference;
            cumulative += seg.value;
            return (
              <circle
                key={seg.label}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
              />
            );
          })}
        </g>
        <text x="80" y="76" textAnchor="middle" className="fill-[#F8FAFC]" style={{ fontSize: 22, fontWeight: 700 }}>
          {total}
        </text>
        <text x="80" y="94" textAnchor="middle" className="fill-[#64748B]" style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>
          TOTAL
        </text>
      </svg>
      <div className="space-y-2.5">
        {donutSegments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-[#CBD5E1] font-medium">{seg.label}</span>
            <span className="text-xs text-[#64748B] ml-auto font-bold">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AnalyticsPage = () => {
  const [range, setRange] = useState('30d');

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">Insights</p>
          <h1 className="text-3xl font-bold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
            Analytics
          </h1>
          <p className="text-[#64748B] text-xs mt-1.5">Workforce trends across departments, tenure, and cost.</p>
        </div>
        <SelectFilter
          value={range}
          onChange={setRange}
          placeholder="Time range"
          options={[
            { value: '7d', label: 'Last 7 days' },
            { value: '30d', label: 'Last 30 days' },
            { value: '90d', label: 'Last quarter' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label="Headcount" value="248" icon={HiOutlineUsers} trend={4.2} trendLabel="vs last period" accent="#3B82F6" />
        <StatCard label="Avg. Tenure" value="2.4" suffix="yrs" icon={HiOutlineClock} trend={1.1} trendLabel="vs last period" accent="#8B5CF6" />
        <StatCard label="Monthly Payroll" value="$412K" icon={HiOutlineCash} trend={-1.8} trendLabel="vs last period" accent="#10B981" />
        <StatCard label="Attrition Rate" value="3.1" suffix="%" icon={HiOutlineTrendingUp} trend={-0.6} trendLabel="vs last period" accent="#F59E0B" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3" hover>
          <CardHeader eyebrow="Distribution" title="Headcount by Department" icon={HiOutlineUsers} iconColor="#3B82F6" />
          <BarChart />
        </Card>
        <Card className="lg:col-span-2" hover>
          <CardHeader eyebrow="Breakdown" title="Employment Type" icon={HiOutlineTrendingUp} iconColor="#8B5CF6" />
          <DonutChart />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
