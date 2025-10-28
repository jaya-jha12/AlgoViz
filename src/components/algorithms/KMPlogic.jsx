// src/components/algorithms/KMPlogic.jsx
export function computeLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  const steps = [];

  // Initial step showing empty LPS
  steps.push({
    i: 0,
    len: 0,
    action: 'Initialize: lps[0] = 0 (every string has empty prefix)',
    currentLPS: [...lps],
    pseudocodeLine: 0,
    headers: ['Index', 'Pattern', 'LPS'],
    rows: Array.from({ length: pattern.length }, (_, idx) => [
      idx,
      pattern[idx],
      lps[idx]
    ])
  });

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      // Characters match
      len++;
      lps[i] = len;
      steps.push({
        i,
        len,
        action: `Match found: pattern[${i}]='${pattern[i]}' == pattern[${len - 1}]='${pattern[len - 1]}' → lps[${i}] = ${len}`,
        currentLPS: [...lps],
        pseudocodeLine: 3,
        headers: ['Index', 'Pattern', 'LPS'],
        rows: Array.from({ length: pattern.length }, (_, idx) => [
          idx,
          pattern[idx],
          lps[idx]
        ])
      });
      i++;
    } else {
      // Characters don't match
      if (len !== 0) {
        len = lps[len - 1];
        steps.push({
          i,
          len,
          action: `Mismatch: pattern[${i}]='${pattern[i]}' != pattern[${len}]='${pattern[len]}' → backtrack to lps[${len}] = ${len}`,
          currentLPS: [...lps],
          pseudocodeLine: 6,
          headers: ['Index', 'Pattern', 'LPS'],
          rows: Array.from({ length: pattern.length }, (_, idx) => [
            idx,
            pattern[idx],
            lps[idx]
          ])
        });
      } else {
        lps[i] = 0;
        steps.push({
          i,
          len: 0,
          action: `Mismatch at start: pattern[${i}]='${pattern[i]}' != pattern[0]='${pattern[0]}' → lps[${i}] = 0`,
          currentLPS: [...lps],
          pseudocodeLine: 8,
          headers: ['Index', 'Pattern', 'LPS'],
          rows: Array.from({ length: pattern.length }, (_, idx) => [
            idx,
            pattern[idx],
            lps[idx]
          ])
        });
        i++;
      }
    }
  }

  return { lps, steps };
}

export function kmpSearch(text = '', pattern = '') {
  // Defensive guard
  if (!text || !pattern) {
    return {
      preprocessSteps: [],
      searchSteps: [],
      matches: [],
      lps: [],
    };
  }

  // Preprocessing
  const { lps, steps: lpsSteps } = computeLPS(pattern);
  const preprocessSteps = lpsSteps.map(step => ({
    ...step,
    headers: ['Index', 'Pattern', 'LPS'],
    rows: Array.from({ length: pattern.length }, (_, idx) => [
      idx,
      pattern[idx],
      step.currentLPS[idx]
    ])
  }));

  // Search phase
  const searchSteps = [];
  const matches = [];

  let i = 0; // index for text
  let j = 0; // index for pattern

  while (i < text.length) {
    // Determine which pseudocode line is executing
    let pseudocodeLine = 1; // While i < n

    if (j > 0 && text[i] !== pattern[j]) {
      pseudocodeLine = 7; // j > 0 check and use lps
    } else if (text[i] === pattern[j]) {
      pseudocodeLine = 2; // If pattern[j] == text[i]
    } else if (j === 0) {
      pseudocodeLine = 11; // Else increment i
    }

    searchSteps.push({
      phase: 'search',
      i,
      j,
      textIndex: i,
      patternIndex: j,
      matches: [...matches],
      action: text[i] === pattern[j]
        ? `Characters match: text[${i}]='${text[i]}' == pattern[${j}]='${pattern[j]}'`
        : j !== 0
          ? `Mismatch: text[${i}]='${text[i]}' != pattern[${j}]='${pattern[j]}' → use LPS to jump`
          : `Mismatch: text[${i}]='${text[i]}' != pattern[0]='${pattern[0]}' → move text pointer`,
      pseudocodeLine,
      headers: ['Index', 'Text', 'Comparison'],
      rows: Array.from({ length: Math.min(i + pattern.length, text.length) }, (_, idx) => [
        idx,
        text[idx],
        idx === i ? '↓' : ''
      ])
    });

    if (text[i] === pattern[j]) {
      i++;
      j++;
    }

    if (j === pattern.length) {
      matches.push(i - j); // pattern found
      searchSteps.push({
        phase: 'search',
        i,
        j,
        textIndex: i,
        patternIndex: j,
        matches: [...matches],
        action: `✓ Pattern found at index ${i - j}!`,
        pseudocodeLine: 4,
        headers: ['Index', 'Text', 'Comparison'],
        rows: Array.from({ length: Math.min(i + pattern.length, text.length) }, (_, idx) => [
          idx,
          text[idx],
          idx >= (i - j) && idx < i ? '✓' : ''
        ])
      });
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return {
    preprocessSteps,
    searchSteps,
    matches,
    lps,
  };
}
