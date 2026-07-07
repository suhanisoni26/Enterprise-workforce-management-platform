/**
 * Generic data table.
 * columns: [{ key, header, render?: (row) => node, width? }]
 * rows: array of data objects (must include a stable `id` or pass getRowId)
 */
const Table = ({ columns, rows, getRowId = (r) => r.id, onRowClick }) => (
  <div className="w-full overflow-x-auto custom-scrollbar">
    <table className="w-full text-left border-collapse min-w-[720px]">
      <thead>
        <tr className="border-b" style={{ borderColor: 'var(--border-color, rgba(148,163,184,0.12))' }}>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-widest text-[#64748B] whitespace-nowrap"
              style={{ width: col.width }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={getRowId(row)}
            onClick={() => onRowClick?.(row)}
            className={`border-b transition-colors ${onRowClick ? 'cursor-pointer hover:bg-white/[0.03]' : ''}`}
            style={{ borderColor: 'rgba(148,163,184,0.06)' }}
          >
            {columns.map((col) => (
              <td key={col.key} className="px-6 py-4 text-xs text-[#CBD5E1] whitespace-nowrap">
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
