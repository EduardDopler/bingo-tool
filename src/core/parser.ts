export interface ParseResult {
  parsed: string[];
  hasWarning: boolean;
  count: number;
}

/**
 * Parses a clipboard text input row-first, separating by any non-digit character.
 * Prepends a zero to single-digit numbers and converts negative values to positive.
 */
export function parseBingoInput(text: string): ParseResult {
  // Extract all digit sequences.
  // Since '-' is a non-digit character, negative numbers naturally split
  // and are parsed as positive digits.
  const matches = text.match(/\d+/g) || [];
  const count = matches.length;
  const hasWarning = count !== 25;

  const parsed = Array(25).fill("");
  const limit = Math.min(count, 25);
  for (let i = 0; i < limit; i++) {
    const val = matches[i];
    parsed[i] = val.length === 1 ? "0" + val : val;
  }

  return {
    parsed,
    hasWarning,
    count,
  };
}
