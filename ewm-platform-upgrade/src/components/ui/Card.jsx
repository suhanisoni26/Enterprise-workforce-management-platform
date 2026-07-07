const Card = ({ children, className = '', padded = true, hover = false, style = {} }) => (
  <div
    className={`rounded-2xl border animate-fade-in-up ${padded ? 'p-6 sm:p-7' : ''} ${
      hover ? 'transition-all duration-300 hover:border-[rgba(148,163,184,0.3)] hover:shadow-[0_0_24px_rgba(59,130,246,0.06)]' : ''
    } ${className}`}
    style={{
      backgroundColor: 'var(--surface, #1E293B)',
      borderColor: 'var(--border-color, rgba(148,163,184,0.12))',
      ...style,
    }}
  >
    {children}
  </div>
);

export const CardHeader = ({ eyebrow, title, action, icon: Icon, iconColor = '#3B82F6' }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div className="flex items-center gap-3">
      {Icon && (
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: 'rgba(148,163,184,0.08)' }}
        >
          <Icon className="w-4.5 h-4.5" style={{ color: iconColor }} />
        </div>
      )}
      <div>
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] mb-0.5">
            {eyebrow}
          </p>
        )}
        <h3 className="text-base font-semibold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h3>
      </div>
    </div>
    {action}
  </div>
);

export default Card;
