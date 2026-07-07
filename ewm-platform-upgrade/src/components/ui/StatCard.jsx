import { HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';

/**
 * <StatCard label="Total Employees" value="248" icon={HiOutlineUsers}
 *   trend={4.2} trendLabel="vs last month" accent="#3B82F6" />
 */
const StatCard = ({ label, value, icon: Icon, trend, trendLabel, accent = '#3B82F6', suffix, loading = false }) => {
  if (loading) {
    return (
      <div
        className="p-6 rounded-2xl border min-h-[152px] flex flex-col justify-between"
        style={{ backgroundColor: 'var(--surface, #1E293B)', borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}
      >
        <div className="skeleton h-3 w-24 rounded" />
        <div className="skeleton h-9 w-16 rounded" />
        <div className="skeleton h-3 w-32 rounded" />
      </div>
    );
  }

  const isUp = typeof trend === 'number' && trend >= 0;

  return (
    <div
      className="p-6 rounded-2xl border min-h-[152px] flex flex-col justify-between transition-all duration-300 hover:border-[rgba(148,163,184,0.28)] animate-fade-in-up"
      style={{
        backgroundColor: 'var(--surface, #1E293B)',
        borderColor: 'var(--border-color, rgba(148,163,184,0.12))',
        boxShadow: `0 0 0 rgba(0,0,0,0)`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 24px ${accent}14`)}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)')}
    >
      <div className="flex items-start justify-between">
        <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">{label}</span>
        {Icon && (
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${accent}1F` }}>
            <Icon className="w-4.5 h-4.5" style={{ color: accent }} />
          </div>
        )}
      </div>

      <h2 className="text-4xl font-bold text-[#F8FAFC] my-3" style={{ fontFamily: 'var(--font-display)' }}>
        {value}
        {suffix && <span className="text-lg text-[#64748B] ml-1">{suffix}</span>}
      </h2>

      {typeof trend === 'number' && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
              isUp ? 'text-[#10B981]' : 'text-[#EF4444]'
            }`}
            style={{ backgroundColor: isUp ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)' }}
          >
            {isUp ? <HiOutlineArrowUp className="w-3 h-3" /> : <HiOutlineArrowDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
          {trendLabel && <span className="text-[10px] text-[#64748B] font-medium uppercase tracking-wider">{trendLabel}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
