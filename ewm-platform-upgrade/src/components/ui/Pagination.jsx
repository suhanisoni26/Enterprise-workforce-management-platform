import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';

const Pagination = ({ page, totalPages, totalItems, pageSize, onPageChange }) => {
  if (totalPages <= 0) return null;

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pageNumbers = () => {
    const nums = [];
    const windowSize = 1;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - windowSize && i <= page + windowSize)) {
        nums.push(i);
      } else if (nums[nums.length - 1] !== '...') {
        nums.push('...');
      }
    }
    return nums;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t" style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
      <p className="text-[11px] text-[#64748B] font-medium">
        Showing <span className="text-[#CBD5E1] font-bold">{start}–{end}</span> of{' '}
        <span className="text-[#CBD5E1] font-bold">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(148,163,184,0.14)] text-[#94A3B8] hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <HiOutlineChevronLeft className="w-4 h-4" />
        </button>
        {pageNumbers().map((n, i) =>
          n === '...' ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-[11px] text-[#475569]">
              …
            </span>
          ) : (
            <button
              key={n}
              onClick={() => onPageChange(n)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-colors ${
                n === page ? 'text-white' : 'text-[#94A3B8] hover:bg-white/5 hover:text-white border border-[rgba(148,163,184,0.14)]'
              }`}
              style={n === page ? { backgroundColor: '#3B82F6' } : {}}
            >
              {n}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(148,163,184,0.14)] text-[#94A3B8] hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <HiOutlineChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
