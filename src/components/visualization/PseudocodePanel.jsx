import React, { useEffect, useRef } from 'react';

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
  const highlightedLineRef = useRef(null);

  // Scroll the highlighted line into view
  useEffect(() => {
    if (highlightedLineRef.current) {
      highlightedLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [currentStep?.pseudocodeLine]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <h4 className="font-bold text-lg">
          Pseudocode – {algorithm.toUpperCase()} [{phase === 'preprocessing' ? 'Preprocessing' : 'Search'}]
        </h4>
        {currentStep && (
          <p className="text-xs text-blue-100 mt-2">{currentStep.action}</p>
        )}
      </div>
      <div className="p-0 space-y-0 max-h-96 overflow-y-auto flex-1">
        {lines.length > 0 ? (
          lines.map((line, idx) => {
            const isHighlighted = currentStep?.pseudocodeLine === idx;
            return (
              <div
                key={idx}
                ref={isHighlighted ? highlightedLineRef : null}
                className={`px-4 py-3 font-mono text-sm border-l-4 transition-all duration-200 ${
                  isHighlighted
                    ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-l-yellow-500 font-semibold text-yellow-900 shadow-md'
                    : 'bg-gray-50 border-l-transparent hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isHighlighted && (
                    <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                  )}
                  <span>{line}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-sm text-gray-500 italic p-4">No pseudocode available</div>
        )}
      </div>
    </div>
  );
}
