import React from 'react';

const pseudocode = {
  kmp: {
    preprocessing: [
      '1. Initialize lps array of size m with all 0s',
      '2. Set len = 0, i = 1',
      '3. While i < m:',
      '4.   If pattern[i] == pattern[len]:',
      '5.     Set lps[i] = len + 1',
      '6.     Increment len and i',
      '7.   Else if len > 0:',
      '8.     Set len = lps[len - 1]',
      '9.   Else:',
      '10.    Set lps[i] = 0',
      '11.    Increment i',
      '12. Return lps array',
    ],
    search: [
      '1. Initialize i = 0, j = 0 (text and pattern indices)',
      '2. While i < n (text length):',
      '3.   If pattern[j] == text[i]:',
      '4.     Increment both i and j',
      '5.   If j == m (pattern length):',
      '6.     Record match at index i - j',
      '7.     Set j = lps[j - 1]',
      '8.   Else if text[i] != pattern[j]:',
      '9.     If j > 0:',
      '10.      Set j = lps[j - 1]',
      '11.    Else:',
      '12.      Increment i',
      '13. Return all match indices',
    ],
  },
  boyerMoore: {
    preprocessing: [
      '1. Initialize bad character table',
      '2. For each character in pattern:',
      '3.   Set table[char] = its last occurrence index',
      '4. Characters not in pattern get value -1',
      '5. Return bad character table',
    ],
    search: [
      '1. Initialize s = 0 (shift position)',
      '2. While s <= n - m (text length - pattern length):',
      '3.   Set j = m - 1 (start from end of pattern)',
      '4.   While j >= 0 and pattern[j] == text[s + j]:',
      '5.     Decrement j',
      '6.   If j < 0:',
      '7.     Pattern found at index s',
      '8.     Calculate shift using last occurrence',
      '9.   Else:',
      '10.    Get character at text[s + j]',
      '11.    Calculate shift = max(1, j - lastOccurrence)',
      '12.    Set s = s + shift',
      '13. Return all match indices',
    ],
  },
};

export default function PseudocodePanel({ algorithm, currentStep, phase }) {
  const lines = pseudocode[algorithm]?.[phase] || [];
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h4 className="font-bold text-lg">
          Pseudocode – {algorithm.toUpperCase()} [{phase === 'preprocessing' ? 'Preprocessing' : 'Search'}]
        </h4>
      </div>
      <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
        {lines.length > 0 ? (
          lines.map((line, idx) => (
            <div
              key={idx}
              className={`p-2 rounded font-mono text-sm transition-all ${
                currentStep?.pseudocodeLine === idx
                  ? 'bg-yellow-200 border-l-4 border-yellow-600 font-semibold'
                  : 'bg-gray-50 border-l-4 border-transparent hover:bg-gray-100'
              }`}
            >
              {line}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">No pseudocode available</div>
        )}
      </div>
    </div>
  );
}
