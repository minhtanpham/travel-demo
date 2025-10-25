/**
 * Price formatting utilities
 */

/**
 * Format a number as currency with proper separators
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'VND')
 * @param locale - The locale for formatting (default: 'vi-VN')
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string = "VND",
  locale: string = "vi-VN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with thousands separators (without currency symbol)
 * @param value - The numeric value to format
 * @param decimals - Number of decimal places (default: 2)
 * @param locale - The locale for formatting (default: 'vi-VN')
 * @returns Formatted number string
 */
export function formatNumber(
  value: number,
  decimals: number = 2,
  locale: string = "vi-VN"
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format price with custom currency symbol prefix
 * @param value - The numeric value to format
 * @param symbol - Currency symbol (default: '₫')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted price string with symbol
 */
export function formatPrice(
  value: number,
  symbol: string = "₫",
  decimals: number = 2
): string {
  const formatted = formatNumber(value, decimals);
  return `${symbol}${formatted}`;
}

/**
 * Format price for compact display (e.g., 1.2K, 1.5M)
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'VND')
 * @param locale - The locale for formatting (default: 'vi-VN')
 * @returns Compact formatted currency string
 */
export function formatCurrencyCompact(
  value: number,
  currency: string = "VND",
  locale: string = "vi-VN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
