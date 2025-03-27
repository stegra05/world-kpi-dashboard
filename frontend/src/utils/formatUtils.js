/**
 * Formats a number according to German locale (de-DE)
 * Only formats if the input is a number, otherwise returns the input as is
 * @param {number|string} value - The value to format
 * @returns {string} Formatted number or original value if not a number
 */
export const formatNumber = (value) => {
  if (typeof value === 'number') {
    return value.toLocaleString('de-DE');
  }
  return value;
}; 