/** Preview of a report's columns with made-up rows. Scrolls sideways for wide reports. */
export default function CompanyReportSampleTable({ sample }) {
  if (!sample) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">Sample output</span>
        <span className="text-[11px] text-text-tertiary">Example data, not from your event</span>
      </div>
      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full text-xs border-collapse">
          <thead className="bg-bg-secondary">
            <tr>
              {sample.columns.map((col) => (
                <th
                  key={col}
                  className="text-left font-semibold text-text-secondary px-3 py-2 whitespace-nowrap border-b border-border"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sample.rows.map((row, ri) => (
              <tr key={ri} className="border-b border-border last:border-b-0">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 text-text-primary whitespace-nowrap">
                    {cell || <span className="text-text-tertiary">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="text-[11px] text-text-tertiary">{sample.columns.length} columns shown.</span>
    </div>
  );
}
