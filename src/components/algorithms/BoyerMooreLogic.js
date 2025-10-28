// src/components/algorithms/BoyerMooreLogic.js
export function buildBadCharTable(pattern = '') {
  const table = {};
  const steps = [];

  for (let i = 0; i < pattern.length; i++) {
    table[pattern[i]] = i;
    
    const rows = [];
    const chars = new Set(pattern.substring(0, i + 1).split(''));
    for (const char of chars) {
      rows.push([char, table[char]]);
    }
    
    steps.push({
      index: i,
      char: pattern[i],
      action: `Setting last occurrence of '${pattern[i]}' = ${i}`,
      table: { ...table },
      pseudocodeLine: 2,
      headers: ['Character', 'Last Occurrence'],
      rows: rows
    });
  }

  return { table, steps };
}

export function boyerMooreSearch(text = '', pattern = '') {
  if (!text || !pattern) {
    return {
      preprocessSteps: [],
      searchSteps: [],
      matches: [],
      badCharTable: {},
    };
  }

  const { table, steps: preprocessSteps } = buildBadCharTable(pattern);
  const matches = [];
  const searchSteps = [];

  const m = pattern.length;
  const n = text.length;

  let s = 0; // shift of the pattern with respect to text

  while (s <= n - m) {
    let j = m - 1;

    // Compare pattern and text from right to left
    while (j >= 0 && pattern[j] === text[s + j]) {
      searchSteps.push({
        phase: 'search',
        shift: s,
        j,
        textIndex: s + j,
        patternIndex: j,
        matches: [...matches],
        action: `Match at text[${s + j}] ('${text[s + j]}')`,
        pseudocodeLine: 3,
        headers: ['Index', 'Text', 'Comparison'],
        rows: Array.from({ length: Math.min(s + m, text.length) }, (_, idx) => [
          idx,
          text[idx],
          idx >= s && idx < s + m ? (idx === s + j ? '↓' : '✓') : ''
        ])
      });
      j--;
    }

    // If pattern is found
    if (j < 0) {
      searchSteps.push({
        phase: 'search',
        shift: s,
        j,
        textIndex: s,
        patternIndex: 0,
        matches: [...matches],
        action: `Pattern found at index ${s}`,
        pseudocodeLine: 6,
        headers: ['Index', 'Text', 'Comparison'],
        rows: Array.from({ length: Math.min(s + m, text.length) }, (_, idx) => [
          idx,
          text[idx],
          idx >= s && idx < s + m ? '✓' : ''
        ])
      });
      matches.push(s);

      if (s + m < n) {
        const shiftAmount = m - (table[text[s + m]] ?? -1);
        s += shiftAmount;
      } else {
        s += 1;
      }
    } else {
      // Mismatch found
      const badChar = text[s + j];
      const shiftAmount = Math.max(1, j - (table[badChar] ?? -1));

      searchSteps.push({
        phase: 'search',
        shift: s,
        j,
        textIndex: s + j,
        patternIndex: j,
        matches: [...matches],
        action: `Mismatch at text[${s + j}] ('${badChar}') → shift by ${shiftAmount}`,
        pseudocodeLine: 10,
        headers: ['Index', 'Text', 'Comparison'],
        rows: Array.from({ length: Math.min(s + m, text.length) }, (_, idx) => [
          idx,
          text[idx],
          idx === s + j ? '✗' : ''
        ])
      });

      // Shift the pattern
      s += shiftAmount;
    }
  }

  return {
    preprocessSteps,
    searchSteps,
    matches,
    badCharTable: table,
  };
}
