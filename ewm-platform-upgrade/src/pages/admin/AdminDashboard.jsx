import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUsers,
  HiOutlineCheckCircle,
  HiOutlineClipboardList,
  HiOutlineExclamationCircle,
  HiOutlineTrendingUp,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineUserAdd,
  HiOutlineOfficeBuilding,
  HiOutlineChartBar,
} from 'react-icons/hi';
import StatCard from '../../components/ui/StatCard';
import Card, { CardHeader } from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/States';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated fetch — swap for a real analytics/summary API call.
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { label: 'Total Employees', value: '248', icon: HiOutlineUsers, trend: 4.2, trendLabel: 'vs last month', accent: '#3B82F6' },
    { label: 'Active Shifts', value: '18', icon: HiOutlineCheckCircle, trend: 2.1, trendLabel: 'coverage stable', accent: '#10B981' },
    { label: 'Pending Leaves', value: '11', icon: HiOutlineClipboardList, trend: -3.5, trendLabel: 'vs last week', accent: '#F59E0B' },
    { label: 'System Alerts', value: '0', icon: HiOutlineExclamationCircle, trend: 0, trendLabel: 'no anomalies', accent: '#22D3EE' },
  ];

  const quickActions = [
    { label: 'Create Employee', desc: 'Onboard a new hire', icon: HiOutlineUserAdd, path: '/admin/create-employee' },
    { label: 'Departments', desc: 'Manage org structure', icon: HiOutlineOfficeBuilding, path: '/admin/departments' },
    { label: 'View Analytics', desc: 'Workforce insights', icon: HiOutlineChartBar, path: '/admin/analytics' },
    { label: 'AI Assistant', desc: 'Ask ops questions', icon: HiOutlineSparkles, path: '/admin/ai-assistant' },
  ];

  const activity = [
    { text: 'Sarah Chen submitted a leave request', time: '12m ago', variant: 'warning' },
    { text: 'New employee "Marcus Webb" onboarded', time: '48m ago', variant: 'success' },
    { text: 'Payroll batch for June approved', time: '2h ago', variant: 'info' },
    { text: 'Shift B — HR Operations reassigned', time: '5h ago', variant: 'neutral' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6] mb-1.5">Overview</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
            Good to see you back
          </h1>
          <p className="text-[#64748B] text-xs mt-1.5">Here's what's happening across your workforce today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="md" icon={HiOutlineOfficeBuilding} onClick={() => navigate('/admin/departments')}>
            Departments
          </Button>
          <Button variant="primary" size="md" icon={HiOutlineUserAdd} onClick={() => navigate('/admin/create-employee')}>
            Create Employee
          </Button>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} loading={loading} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((qa) => (
          <button
            key={qa.label}
            onClick={() => navigate(qa.path)}
            className="text-left p-5 rounded-2xl border transition-all duration-300 hover:border-[rgba(59,130,246,0.35)] hover:-translate-y-0.5 group"
            style={{ backgroundColor: 'var(--surface, #1E293B)', borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}
          >
            <qa.icon className="w-5 h-5 text-[#3B82F6] mb-3" />
            <p className="text-xs font-bold text-[#F8FAFC]">{qa.label}</p>
            <p className="text-[10px] text-[#64748B] mt-0.5">{qa.desc}</p>
            <HiOutlineArrowRight className="w-3.5 h-3.5 text-[#3B82F6] mt-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Efficiency Chart */}
        <Card className="lg:col-span-3" hover>
          <CardHeader
            eyebrow="This Week"
            title="Workforce Efficiency Density"
            icon={HiOutlineTrendingUp}
            iconColor="#3B82F6"
            action={<Badge variant="success" dot>Trending Up</Badge>}
          />
          <div className="relative w-full h-[220px]">
            <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
              <line x1="0" y1="150" x2="500" y2="150" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
              <path
                d="M 0 170 C 50 160, 100 110, 150 120 C 200 130, 250 50, 300 70 C 350 90, 400 140, 450 130 L 500 100 L 500 200 L 0 200 Z"
                fill="url(#chartGrad)"
              />
              <path
                d="M 0 170 C 50 160, 100 110, 150 120 C 200 130, 250 50, 300 70 C 350 90, 400 140, 450 130 L 500 100"
                fill="none"
                stroke="#3B82F6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="150" cy="120" r="3.5" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2" />
              <circle cx="250" cy="50" r="3.5" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2" />
              <circle cx="450" cy="130" r="3.5" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2" />
            </svg>
            <div className="absolute left-0 top-0 text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Efficiency Index</div>
            <div className="absolute right-0 bottom-0 text-[9px] text-[#64748B] font-bold uppercase tracking-wider">Today</div>
          </div>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-2" hover>
          <CardHeader eyebrow="Live Feed" title="Recent Activity" icon={HiOutlineClipboardList} iconColor="#8B5CF6" />
          {activity.length === 0 ? (
            <EmptyState title="No recent activity" description="New events from across the platform will appear here." />
          ) : (
            <div className="space-y-1">
              {activity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-3 border-b last:border-0" style={{ borderColor: 'rgba(148,163,184,0.06)' }}>
                  <Badge variant={a.variant} dot />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#CBD5E1] leading-snug">{a.text}</p>
                    <p className="text-[10px] text-[#64748B] mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Operations Log */}
      <Card hover>
        <CardHeader eyebrow="System" title="Operations Log" icon={HiOutlineExclamationCircle} iconColor="#EF4444" />
        <div
          className="p-5 rounded-xl bg-black/40 text-[#94A3B8] font-mono text-[11px] overflow-x-auto leading-relaxed border custom-scrollbar"
          style={{ borderColor: 'rgba(148,163,184,0.08)', minHeight: '160px', fontFamily: 'var(--font-mono)' }}
        >
          <p className="text-[#475569]">// System process log initialized...</p>
          <p className="text-[#10B981]">[OK] Database connection pool verified. (20ms)</p>
          <p className="text-[#10B981]">[OK] AI Model engine loaded. (v1.0.4-release)</p>
          <p className="text-[#F59E0B]">[WARN] High memory footprint detected in background worker thread 4.</p>
          <p className="text-[#10B981]">[OK] Seeding complete. Created Super Admin credentials.</p>
          <p className="text-[#64748B]">[LOG] Shift A — Engineering auto-allocated to 14 active terminals.</p>
          <p className="text-[#818CF8]">[INFO] Listening on http://localhost:5000/api</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
