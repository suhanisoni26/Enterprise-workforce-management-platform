import { HiOutlineX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, description, children, size = 'md' }) => {
  if (!isOpen) return null;
  const widths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${widths[size]} rounded-2xl border shadow-2xl animate-fade-in-up max-h-[90vh] overflow-y-auto custom-scrollbar`}
        style={{ backgroundColor: 'var(--bg-elevated, #0B1220)', borderColor: 'var(--border-color, rgba(148,163,184,0.14))' }}
      >
        <div className="flex items-start justify-between px-7 pt-7 pb-2">
          <div>
            <h2 className="text-xl font-semibold text-[#F8FAFC]" style={{ fontFamily: 'var(--font-display)' }}>
              {title}
            </h2>
            {description && <p className="text-xs text-[#64748B] mt-1.5">{description}</p>}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#64748B] hover:text-white hover:bg-white/5 transition-colors">
            <HiOutlineX className="w-4.5 h-4.5" />
          </button>
        </div>
        <div className="px-7 pb-7 pt-3">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
