// src/components/algorithms/KMPlogic.jsx
export function computeLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;
  const steps = [];

  while (i < pattern.length) {
    steps.push({
      i,
      len,
      action: pattern[i] === pattern[len]
        ? 'Match → Increment both'
        : len > 0
          ? 'Mismatch → Go back using lps[len - 1]'
          : 'Mismatch → Set lps[i] = 0 and move forward',
      currentLPS: [...lps],
    });

    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
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
  // We'll keep preprocessing steps separate from search steps for the UI
  const preprocessSteps = [...lpsSteps];

  // Search phase
  const searchSteps = [];
  const matches = [];

  let i = 0; // index for text
  let j = 0; // index for pattern

  while (i < text.length) {
    searchSteps.push({
      phase: 'search',
      i,
      j,
      action: text[i] === pattern[j]
        ? 'Characters match → move both forward'
        : j !== 0
          ? 'Mismatch → jump using lps'
          : 'Mismatch → move text pointer forward',
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
        action: `Pattern found at index ${i - j}`,
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
