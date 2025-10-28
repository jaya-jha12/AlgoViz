import React from 'react';

export default function PreprocessingTable({ algorithm, pattern, preprocessStep, searchStep }) {
  return (
    <div className="overflow-auto bg-white rounded-lg shadow p-4">
      <h4 className="font-semibold mb-2">Pre-processing Table ({algorithm})</h4>
      {preprocessStep ? (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr>
              {/* --- FIX 1: Added || [] --- */}
              {(preprocessStep.headers || []).map((h, i) => (
                <th key={i} className="border px-2 py-1 text-left">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* --- FIX 2: Added || [] --- */}
            {(preprocessStep.rows || []).map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci} className="border px-2 py-1">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-sm text-gray-500">No preprocessing data to show.</div>
      )}
      {searchStep && (
        <div className="mt-4">
          <h4 className="font-semibold mb-1">Search Phase Data</h4>
          <pre className="text-sm bg-gray-50 p-2 rounded">{JSON.stringify(searchStep, null, 2)}</pre>
        </div>
     )}
    </div>
  );
}