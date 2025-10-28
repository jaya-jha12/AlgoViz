// src/components/algorithms/BoyerMooreLogic.js (or .jsx)
export function buildBadCharTable(pattern = '') {
  const table = {};
  const steps = [];

  for (let i = 0; i < pattern.length; i++) {
    table[pattern[i]] = i;
    steps.push({
      index: i,
      char: pattern[i],
      action: `Setting last occurrence of '${pattern[i]}' = ${i}`,
      table: { ...table },
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
        action: `Match at text[${s + j}] ('${text[s + j]}')`,
      });
      j--;
    }

    // If pattern is found
    if (j < 0) {
      searchSteps.push({
        phase: 'search',
        shift: s,
        j,
        action: `Pattern found at index ${s}`,
      });
      matches.push(s);

      if (s + m < n) {
        s += m - (table[text[s + m]] ?? -1);
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
        action: `Mismatch at text[${s + j}] ('${badChar}') → shift by ${shiftAmount}`,
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
