import React from 'react';

const pseudocode = {
  kmp: {
    preprocessing: [
      'Compute prefix function / lps array',
      'Initialize i = 1, length = 0',
      // more lines …
    ],
    search: [
      'If pattern[i] == text[j], increment both',
      'Else if length != 0, length = lps[length-1]',
      // more lines …
    ],
  },
  boyerMoore: {
    preprocessing: [
      'Build bad character table',
      'Build good suffix table',
      // more lines …
    ],
    search: [
      'Compare pattern from end to text',
      'If mismatch, shift by max(badCharShift, goodSuffixShift)',
      // more lines …
    ],
  },
};

export default function PseudocodePanel({ algorithm, currentStep, phase }) {
  const lines = pseudocode[algorithm]?.[phase] || [];
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-semibold mb-2">Pseudocode – {algorithm.toUpperCase()} [{phase}]</h4>
      <ol className="list-decimal list-inside text-sm space-y-1">
        {lines.map((line, idx) => (
          <li
            key={idx}
            className={currentStep?.pseudocodeLine === idx ? 'bg-yellow-100' : ''}
          >
            {line}
          </li>
        ))}
      </ol>
    </div>
  );
}
