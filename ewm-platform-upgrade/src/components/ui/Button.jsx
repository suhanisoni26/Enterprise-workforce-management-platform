import { HiOutlineRefresh } from 'react-icons/hi';

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold uppercase tracking-wider text-xs rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 whitespace-nowrap';

const SIZES = {
  sm: 'px-3.5 py-2 text-[11px]',
  md: 'px-5 py-2.5',
  lg: 'px-6 py-3.5 text-[13px]',
};

const VARIANTS = {
  primary:
    'text-white shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2b7bfa] hover:to-[#1d4fd8]',
  accent:
    'text-white shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]',
  secondary:
    'text-[#F8FAFC] bg-[#1E293B] border border-[rgba(148,163,184,0.16)] hover:bg-[#25324a] hover:border-[rgba(148,163,184,0.3)]',
  ghost:
    'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 border border-transparent',
  danger:
    'text-white bg-gradient-to-r from-[#EF4444] to-[#DC2626] shadow-lg shadow-red-500/10 hover:shadow-red-500/20',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`${BASE} ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    {...rest}
  >
    {loading ? (
      <HiOutlineRefresh className="w-4 h-4 animate-spin" />
    ) : (
      Icon && <Icon className="w-4 h-4" />
    )}
    {children}
  </button>
);

export default Button;
