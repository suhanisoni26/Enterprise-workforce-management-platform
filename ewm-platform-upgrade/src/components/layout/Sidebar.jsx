/**
 * Sidebar Navigation — Enterprise dark theme.
 * Responsive: fixed drawer on mobile (controlled by isOpen/onClose), static on lg+.
 */

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineCurrencyDollar,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineSparkles,
  HiOutlineUserAdd,
  HiOutlineOfficeBuilding,
  HiOutlineChartBar,
  HiOutlineBriefcase,
  HiOutlineX,
} from 'react-icons/hi';

const Sidebar = ({ isAdmin = false, isOpen = false, onClose = () => {} }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = isAdmin
    ? [
        { name: 'Dashboard', path: '/admin/dashboard', icon: HiOutlineHome },
        { name: 'Employees', path: '/admin/employees', icon: HiOutlineUsers },
        { name: 'Create Employee', path: '/admin/create-employee', icon: HiOutlineUserAdd },
        { name: 'Departments', path: '/admin/departments', icon: HiOutlineOfficeBuilding },
        { name: 'Recruitment', path: '/admin/recruitment', icon: HiOutlineBriefcase },
        { name: 'Analytics', path: '/admin/analytics', icon: HiOutlineChartBar },
        { name: 'AI Assistant', path: '/admin/ai-assistant', icon: HiOutlineSparkles },
        { name: 'Settings', path: '/admin/settings', icon: HiOutlineCog },
      ]
    : [
        { name: 'Dashboard', path: '/employee/dashboard', icon: HiOutlineHome },
        { name: 'Attendance', path: '/employee/attendance', icon: HiOutlineCalendar },
        { name: 'Leave Requests', path: '/employee/leave', icon: HiOutlineClipboardList },
        { name: 'Payroll', path: '/employee/payroll', icon: HiOutlineCurrencyDollar },
        { name: 'AI Assistant', path: '/employee/ai-assistant', icon: HiOutlineSparkles },
      ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 flex flex-col z-50 border-r transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{
          backgroundColor: 'var(--bg-elevated, #0B1220)',
          borderColor: 'var(--border-color, rgba(148,163,184,0.1))',
        }}
      >
        {/* Brand */}
        <div className="p-6 flex items-center justify-between border-b" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
            >
              <span className="font-bold text-white text-sm">EW</span>
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
                EWM Platform
              </h2>
              <p className="text-[9px] font-bold tracking-widest text-[#64748B] uppercase">
                {isAdmin ? 'Admin Portal' : 'Employee Portal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5">
            <HiOutlineX className="w-4 h-4" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-3 rounded-lg transition-all duration-200 group text-xs font-semibold ${
                  isActive ? 'text-white' : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F8FAFC]'
                }`
              }
              style={({ isActive }) => ({
                background: isActive ? 'linear-gradient(90deg, rgba(59,130,246,0.16), rgba(139,92,246,0.08))' : 'transparent',
                borderLeft: isActive ? '2px solid #3B82F6' : '2px solid transparent',
              })}
            >
              <item.icon className="w-4.5 h-4.5 transition-transform group-hover:scale-110 shrink-0" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          ))}

          {/* AI Assistant promo banner */}
          <div
            onClick={() => navigate(isAdmin ? '/admin/ai-assistant' : '/employee/ai-assistant')}
            className="mt-6 p-4 rounded-xl border relative overflow-hidden group cursor-pointer transition-all hover:border-[rgba(139,92,246,0.4)]"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.1))',
              borderColor: 'rgba(139,92,246,0.18)',
            }}
          >
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(139,92,246,0.18)' }}>
                <HiOutlineSparkles className="w-4 h-4 text-[#A78BFA]" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#F8FAFC]">AI Ops Assistant</p>
                <p className="text-[9px] mt-0.5 text-[#94A3B8] uppercase font-bold tracking-widest">Ask it anything →</p>
              </div>
            </div>
          </div>
        </div>

        {/* User + Logout */}
        <div className="p-3 border-t" style={{ borderColor: 'rgba(148,163,184,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2.5 mb-1 rounded-lg" style={{ backgroundColor: 'rgba(148,163,184,0.04)' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
            >
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-[#F8FAFC] truncate">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-[9px] text-[#64748B] font-semibold uppercase tracking-wider truncate">
                {user?.role?.replace('_', ' ').toLowerCase() || 'employee'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-3 rounded-lg hover:bg-red-500/10 group text-left text-xs font-bold text-[#F87171] transition-colors"
          >
            <HiOutlineLogout className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
