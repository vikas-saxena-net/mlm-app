export default function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-brand-ink text-white">
            {columns.map((col) => (
              <th key={col} className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-orange-50/40"}>
              {row.map((cell, j) => (
                <td key={j} className="px-5 py-3 whitespace-nowrap text-slate-700 font-medium">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
