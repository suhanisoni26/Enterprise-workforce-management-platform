import { HiOutlineInbox, HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';

export const EmptyState = ({
  icon: Icon = HiOutlineInbox,
  title = 'Nothing here yet',
  description = 'Once there is data, it will show up here.',
  action,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
      style={{ backgroundColor: 'rgba(148,163,184,0.08)' }}
    >
      <Icon className="w-6 h-6 text-[#64748B]" />
    </div>
    <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1.5">{title}</h3>
    <p className="text-xs text-[#64748B] max-w-xs leading-relaxed">{description}</p>
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const ErrorState = ({
  title = 'Something went wrong',
  description = "We couldn't load this data. Try again in a moment.",
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
      <HiOutlineExclamationCircle className="w-6 h-6 text-[#EF4444]" />
    </div>
    <h3 className="text-sm font-semibold text-[#F8FAFC] mb-1.5">{title}</h3>
    <p className="text-xs text-[#64748B] max-w-xs leading-relaxed">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-[#F8FAFC] border border-[rgba(148,163,184,0.16)] hover:bg-white/5 transition-colors"
      >
        <HiOutlineRefresh className="w-3.5 h-3.5" />
        Try again
      </button>
    )}
  </div>
);

export const LoadingSpinner = ({ label = 'Loading...', size = 'md' }) => {
  const dims = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-9 h-9' : 'w-6 h-6';
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <svg className={`animate-spin ${dims} text-[#3B82F6]`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
        <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {label && <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest animate-pulse">{label}</p>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 6, cols = 5 }) => (
  <div className="w-full">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center gap-6 px-6 py-4 border-b border-[rgba(148,163,184,0.08)]">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="skeleton h-3 rounded flex-1" style={{ maxWidth: c === 0 ? 160 : 120 }} />
        ))}
      </div>
    ))}
  </div>
);
