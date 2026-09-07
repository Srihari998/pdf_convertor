/**
 * Formats a number according to the Indian numbering system (e.g. ₹8,00,000.00)
 */
export function formatCurrencyINR(amount: number, includeDecimals = true): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const parts = absAmount.toFixed(includeDecimals ? 2 : 0).split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Indian numbering: last 3 digits, then groups of 2
  if (integerPart.length > 3) {
    const lastThree = integerPart.substring(integerPart.length - 3);
    const remaining = integerPart.substring(0, integerPart.length - 3);
    integerPart = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
  }
  
  const formatted = includeDecimals && decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  return `${isNegative ? '-' : ''}₹${formatted}`;
}

/**
 * Formats a standard number with commas
 */
export function formatNumber(val: number, decimals = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: 0,
  }).format(val);
}

/**
 * Rounds a number to specified precision without floating point inaccuracies
 */
export function roundTo(num: number, decimals = 2): number {
  if (isNaN(num) || !isFinite(num)) return 0;
  const factor = Math.pow(10, decimals);
  return Math.round((num + Number.EPSILON) * factor) / factor;
}

/**
 * Formats bytes to human-readable string (KB, MB, GB, TB)
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
