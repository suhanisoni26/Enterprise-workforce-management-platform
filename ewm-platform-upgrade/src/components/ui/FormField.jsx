const baseInputStyle = {
  backgroundColor: 'var(--surface-muted, #172033)',
  borderColor: 'var(--border-color, rgba(148,163,184,0.14))',
  color: '#F8FAFC',
};

export const FormField = ({ label, error, required, children, hint }) => (
  <div>
    <label className="block text-[10px] font-bold tracking-widest text-[#94A3B8] uppercase mb-2.5">
      {label} {required && <span className="text-[#EF4444]">*</span>}
    </label>
    {children}
    {hint && !error && <p className="mt-1.5 text-[10px] text-[#64748B]">{hint}</p>}
    {error && <p className="mt-1.5 text-[10px] text-[#EF4444] font-semibold">{error}</p>}
  </div>
);

export const TextInput = ({ error, className = '', ...rest }) => (
  <input
    className={`w-full px-4 py-3.5 rounded-lg text-xs outline-none transition-colors border focus:border-[#3B82F6] ${className}`}
    style={{ ...baseInputStyle, borderColor: error ? '#EF4444' : baseInputStyle.borderColor }}
    {...rest}
  />
);

export const SelectInput = ({ error, className = '', children, ...rest }) => (
  <select
    className={`w-full px-4 py-3.5 rounded-lg text-xs outline-none transition-colors border cursor-pointer appearance-none focus:border-[#3B82F6] ${className}`}
    style={{ ...baseInputStyle, borderColor: error ? '#EF4444' : baseInputStyle.borderColor }}
    {...rest}
  >
    {children}
  </select>
);
