/**
/**
 * Shared Number & Currency Formatters for UtilityHub Calculators
 */

/**
 * Format a number into Indian Rupee Currency (e.g., ₹1,25,000)
 */
export function formatINR(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  const rounded = Math.round(value);
  try {
    return `₹${rounded.toLocaleString('en-IN')}`;
  } catch {
    return `₹${rounded}`;
  }
}

/**
 * Format a percentage value cleanly without trailing zero noise (e.g., 18% or 12.5%)
 */
export function formatPercent(value: number, maxDecimals = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0%';
  const formatted = Number(value.toFixed(maxDecimals));
  return `${formatted}%`;
}

/**
 * Format a number using Indian Number System (e.g., 1,00,000)
 */
export function formatNumber(value: number, maxDecimals = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  const roundFactor = Math.pow(10, maxDecimals);
  const rounded = Math.round(value * roundFactor) / roundFactor;
  try {
    return rounded.toLocaleString('en-IN');
  } catch {
    return `${rounded}`;
  }
}
