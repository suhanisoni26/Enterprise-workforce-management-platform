/**
 * Top Header — global search, notifications, profile, mobile menu trigger.
 */

import { HiOutlineBell, HiOutlineSearch, HiOutlineMenu } from 'react-icons/hi';
import { useAuth } from '../../hooks/useAuth';
import { roleLabels } from '../../lib/theme';

const Header = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header
      className="sticky top-0 z-30 h-16 sm:h-20 px-4 sm:px-8 flex items-center justify-between gap-4 transition-all border-b backdrop-blur-md"
      style={{
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        borderColor: 'var(--border-color, rgba(148,163,184,0.1))',
      }}
    >
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative group">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] group-focus-within:text-[#3B82F6] transition-colors" />
            <input
              type="text"
              placeholder="Search resources, employees, or ask AI..."
              className="w-full pl-11 pr-4 py-2.5 rounded-lg text-xs outline-none transition-all border"
              style={{
                backgroundColor: 'rgba(148, 163, 184, 0.06)',
                borderColor: 'var(--border-color, rgba(148,163,184,0.1))',
                color: '#F8FAFC',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3B82F6';
                e.target.style.backgroundColor = 'rgba(148,163,184,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color, rgba(148,163,184,0.1))';
                e.target.style.backgroundColor = 'rgba(148,163,184,0.06)';
              }}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[9px] font-bold border"
              style={{ color: '#64748B', borderColor: 'rgba(148,163,184,0.2)' }}
            >
              /
            </div>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-6 shrink-0">
        <button className="relative p-2 rounded-lg hover:bg-white/5 transition-colors group">
          <HiOutlineBell className="w-5 h-5 text-[#94A3B8] group-hover:text-white transition-colors" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] ring-2" style={{ ringColor: '#0F172A' }} />
        </button>

        <div className="flex items-center gap-3 pl-3 sm:pl-6 border-l" style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.1))' }}>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-[#F8FAFC]">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-[9px] text-[#64748B] font-bold uppercase tracking-widest">
              {roleLabels[user?.role] || 'Employee'}
            </p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer transition-all hover:scale-105 shrink-0"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
