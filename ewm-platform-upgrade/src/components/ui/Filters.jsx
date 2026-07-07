import { HiOutlineSearch, HiOutlineChevronDown, HiOutlineX } from 'react-icons/hi';

export const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => (
  <div className={`relative ${className}`}>
    <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-10 pr-9 py-2.5 rounded-lg text-xs outline-none transition-all border"
      style={{
        backgroundColor: 'var(--surface-muted, #172033)',
        borderColor: 'var(--border-color, rgba(148,163,184,0.12))',
        color: '#F8FAFC',
      }}
      onFocus={(e) => (e.target.style.borderColor = '#3B82F6')}
      onBlur={(e) => (e.target.style.borderColor = 'var(--border-color, rgba(148,163,184,0.12))')}
    />
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-white"
      >
        <HiOutlineX className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);

export const SelectFilter = ({ value, onChange, options, placeholder = 'All' }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none pl-3.5 pr-9 py-2.5 rounded-lg text-xs font-medium outline-none cursor-pointer border transition-colors"
      style={{
        backgroundColor: 'var(--surface-muted, #172033)',
        borderColor: 'var(--border-color, rgba(148,163,184,0.12))',
        color: '#F8FAFC',
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
  </div>
);
