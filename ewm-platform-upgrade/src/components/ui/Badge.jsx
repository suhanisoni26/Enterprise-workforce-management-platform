const VARIANTS = {
  success: { bg: 'rgba(16, 185, 129, 0.12)', fg: '#10B981', dot: '#10B981' },
  warning: { bg: 'rgba(245, 158, 11, 0.12)', fg: '#F59E0B', dot: '#F59E0B' },
  danger: { bg: 'rgba(239, 68, 68, 0.12)', fg: '#EF4444', dot: '#EF4444' },
  info: { bg: 'rgba(59, 130, 246, 0.12)', fg: '#3B82F6', dot: '#3B82F6' },
  accent: { bg: 'rgba(139, 92, 246, 0.12)', fg: '#8B5CF6', dot: '#8B5CF6' },
  neutral: { bg: 'rgba(148, 163, 184, 0.12)', fg: '#94A3B8', dot: '#94A3B8' },
};

/**
 * <Badge variant="success" dot>Active</Badge>
 */
const Badge = ({ variant = 'neutral', dot = false, children, className = '' }) => {
  const v = VARIANTS[variant] || VARIANTS.neutral;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border ${className}`}
      style={{ backgroundColor: v.bg, color: v.fg, borderColor: 'transparent' }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: v.dot }} />}
      {children}
    </span>
  );
};

export default Badge;
