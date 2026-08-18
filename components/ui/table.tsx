import React from 'react';

interface TableProps {
  headers: string[];
  rows: (string | number | React.ReactNode)[][];
  className?: string;
}

export function Table({ headers, rows, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 border-b">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                className="px-4 py-3 text-left font-semibold text-slate-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-slate-50">
              {row.map((cell, cellIdx) => (
                <td key={cellIdx} className="px-4 py-3 text-slate-700">
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
