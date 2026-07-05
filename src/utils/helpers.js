// Helper functions for formatting numbers, currency, and percentages

/**
 * Format a number as USD currency
 * @param {number} value
 * @returns {string}
 */
export const formatCurrency = (value) => {
  if (typeof value !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Format a large number with commas
 * @param {number} value
 * @returns {string}
 */
export const formatNumber = (value) => {
  if (typeof value !== 'number') return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format growth percentage
 * @param {number} value
 * @returns {string}
 */
export const formatGrowth = (value) => {
  if (typeof value !== 'number') return '0%';
  const prefix = value >= 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)}%`;
};

/**
 * Format discount rate as percentage
 * @param {number} value (e.g. 0.15)
 * @returns {string} (e.g. 15%)
 */
export const formatDiscount = (value) => {
  if (typeof value !== 'number') return '0%';
  return `${Math.round(value * 100)}%`;
};
