import React from 'react';

interface TableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  className?: string;
}

export function Table({ headers, rows, className = '' }: TableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-xl border border-slate-200/80 ${className}`}
    >
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3.5 text-slate-700">
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
