/**
 * Strict metric shorthand number parser for user inputs.
 * Supports:
 *  - Standard integers and decimals (e.g. 50000, 100.5)
 *  - Metric suffixes K, M, B (case-insensitive: k, K, m, M, b, B)
 *  - Conventional thousands grouping with commas (e.g. 50,000, 1,500,000, 1,500K)
 *  - Whitespace between number and suffix (e.g. "2.5 B")
 *
 * Strictly rejects:
 *  - Ambiguous comma-decimal formats (e.g. "1,5", "1,5M")
 *  - Multiple decimal points (e.g. "1.5.0M")
 *  - Multiple or invalid suffixes (e.g. "10KK", "10Kx")
 *  - Non-numeric tokens (e.g. "abc")
 *  - Negative values (e.g. "-500K", "-10")
 *  - Numbers exceeding Number.MAX_SAFE_INTEGER
 *
 * @param {string|number} value
 * @returns {number|null} Parsed scaled number, or null if invalid/malformed.
 */
export function parseMetricNumber(value) {
  if (value === null || value === undefined) return null;
  const str = String(value).trim();
  if (!str) return null;

  // Reject negative numbers
  if (str.includes('-')) return null;

  // If commas are present, validate standard thousands grouping
  if (str.includes(',')) {
    // Matches e.g. 1,000 or 1,500,000 or 1,500K or 1,500.5M
    const commaRegex = /^(\d{1,3}(,\d{3})+)(\.\d+)?\s*([kmbKMB])?$/;
    const match = str.match(commaRegex);
    if (!match) return null; // Invalid comma placement (e.g. 1,5 or 1,00 or 1,5M)

    const numPart = match[1].replace(/,/g, '') + (match[3] || '');
    const suffix = (match[4] || '').toUpperCase();
    return scaleNumber(numPart, suffix);
  }

  // No commas: standard number with optional single suffix
  const plainRegex = /^(\d+(\.\d+)?|\.\d+)\s*([kmbKMB])?$/;
  const match = str.match(plainRegex);
  if (!match) return null; // Malformed (e.g. 1.5.0M, 10KK, abc, etc.)

  const numPart = match[1];
  const suffix = (match[3] || '').toUpperCase();
  return scaleNumber(numPart, suffix);
}

function scaleNumber(numStr, suffix) {
  const base = parseFloat(numStr);
  if (isNaN(base) || base < 0) return null;

  let multiplier = 1;
  if (suffix === 'K') multiplier = 1000;
  else if (suffix === 'M') multiplier = 1000000;
  else if (suffix === 'B') multiplier = 1000000000;

  const result = base * multiplier;

  // Reject overflow beyond safe integer precision
  if (result > Number.MAX_SAFE_INTEGER) return null;

  // Round to nearest integer for clean count representation
  return Math.round(result);
}

export default parseMetricNumber;

