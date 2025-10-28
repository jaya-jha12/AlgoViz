import React from 'react';

export default function PreprocessingTable({ algorithm, pattern, preprocessStep, searchStep }) {
  const step = preprocessStep || searchStep;

  if (!step) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h4 className="font-semibold text-lg mb-4 text-gray-700">
          {algorithm === 'kmp' ? 'LPS Array' : 'Bad Character Table'} ({algorithm.toUpperCase()})
        </h4>
        <div className="text-sm text-gray-500 italic text-center py-8">
          No data to display. Click Visualize to start.
        </div>
      </div>
    );
  }

  const headers = step.headers || [];
  const rows = step.rows || [];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4">
        <h4 className="font-bold text-lg">
          {algorithm === 'kmp' ? 'LPS Array' : 'Bad Character Table'} ({algorithm.toUpperCase()})
        </h4>
        {step.action && (
          <p className="text-emerald-100 text-sm mt-2">{step.action}</p>
        )}
      </div>

      <div className="p-6">
        {headers.length > 0 && rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300 bg-gray-50">
                  {headers.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-3 text-left font-semibold text-gray-700 text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className={`border-b border-gray-200 transition-colors ${
                      rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className="px-4 py-3 font-mono text-sm"
                      >
                        <div className="flex items-center gap-2">
                          {cell}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500 italic text-center py-8">
            No table data available
          </div>
        )}

        {step.table && Object.keys(step.table).length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">
              {algorithm === 'kmp' ? 'LPS Array Summary' : 'Character Map'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(step.table).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3"
                >
                  <div className="font-mono font-semibold text-blue-900">{key}</div>
                  <div className="text-xs text-blue-700">→ {value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
