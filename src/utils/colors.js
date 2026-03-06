/**
 * Utilidades unificadas para trabajar con colores
 * Incluye funciones para validar y normalizar colores hexadecimales
 */

/**
 * Expresión regular para validar colores hexadecimales
 * Soporta formatos: #RGB y #RRGGBB (case-insensitive)
 */
const HEX_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/

/**
 * Valida si un valor es un color hexadecimal válido
 * @param {string} value - Valor a validar
 * @returns {boolean} True si es un color hexadecimal válido
 * 
 * @example
 * isValidHexColor('#FF0000') // true
 * isValidHexColor('#f00') // true
 * isValidHexColor('red') // false
 */
export function isValidHexColor(value) {
  if (typeof value !== 'string') return false
  return HEX_REGEX.test(value.trim())
}

/**
 * Normaliza un color hexadecimal a formato #rrggbb (minúsculas)
 * Expande colores cortos (#rgb) a formato completo (#rrggbb)
 * @param {string} value - Color hexadecimal a normalizar
 * @param {string} fallback - Color por defecto si el valor no es válido
 * @returns {string} Color hexadecimal normalizado o fallback
 * 
 * @example
 * normalizeHexColor('#F00') // '#ff0000'
 * normalizeHexColor('#FF0000') // '#ff0000'
 * normalizeHexColor('invalid') // '#000000' (fallback por defecto)
 */
export function normalizeHexColor(value, fallback = '#000000') {
  if (!isValidHexColor(value)) return fallback
  const hex = value.trim().toLowerCase()
  
  // Expandir formato corto #rgb a #rrggbb
  if (hex.length === 4) {
    const r = hex[1]
    const g = hex[2]
    const b = hex[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  
  return hex
}
