/** Matches #RGB and #RRGGBB hex color strings (case-insensitive). */
const HEX_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/

/**
 * Returns true if the value is a valid hex color string.
 * @param {string} value
 * @returns {boolean}
 *
 * @example
 * isValidHexColor('#FF0000') // true
 * isValidHexColor('#f00')    // true
 * isValidHexColor('red')     // false
 */
export function isValidHexColor(value) {
  if (typeof value !== 'string') return false
  return HEX_REGEX.test(value.trim())
}

/**
 * Normalizes a hex color to lowercase #rrggbb format.
 * Expands shorthand #rgb to #rrggbb.
 * @param {string} value
 * @param {string} [fallback='#000000'] - Returned when value is invalid.
 * @returns {string}
 *
 * @example
 * normalizeHexColor('#F00')     // '#ff0000'
 * normalizeHexColor('#FF0000')  // '#ff0000'
 * normalizeHexColor('invalid')  // '#000000'
 */
export function normalizeHexColor(value, fallback = '#000000') {
  if (!isValidHexColor(value)) return fallback
  const hex = value.trim().toLowerCase()

  if (hex.length === 4) {
    const r = hex[1]
    const g = hex[2]
    const b = hex[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }

  return hex
}
