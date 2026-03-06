import { useField } from 'formik'
import { useTranslation } from 'react-i18next'

import { DEFAULT_COLORS_TAGS } from '../../helpers/theme'
import { isValidHexColor, normalizeHexColor } from '../../utils/colors'

/**
 * ColorPicker - Componente selector de color integrado con Formik
 * 
 * Permite seleccionar un color desde una paleta predefinida o ingresar un valor hexadecimal personalizado.
 * Valida y normaliza automáticamente los colores hexadecimales ingresados.
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} props.name - Nombre del campo en Formik (requerido)
 * @param {string} [props.label='Color'] - Etiqueta del selector de color
 * @param {string[]} [props.presets=DEFAULT_COLORS_TAGS] - Array de colores predefinidos para mostrar
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @returns {JSX.Element} Selector de color con paleta y input hexadecimal
 */
function ColorPicker({
  name,
  label,
  presets = DEFAULT_COLORS_TAGS,
  className = ''
}) {
  const { t } = useTranslation()
  const [field, meta, helpers] = useField(name)
  const labelText = label || t('CONSTANTS.COLOR')
  const value = (field.value && typeof field.value === 'string') ? field.value : '#000000'

  const handleSelect = (color) => {
    helpers.setValue(color)
  }

  const handleBlurNormalize = () => {
    if (isValidHexColor(field.value)) {
      helpers.setValue(normalizeHexColor(field.value))
    }
    helpers.setTouched(true)
  }

  return (
    <label className={`color-picker ${className} ${meta.touched && meta.error ? 'input--error' : ''}`}>
      <span className="input__label">
        {labelText}
      </span>

      <div className="color-picker__swatches">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            className={`color-picker__swatch 
              ${value?.toLowerCase() === color.toLowerCase() && 'is-active'}`}
            style={{ backgroundColor: color }}
            onClick={() => handleSelect(color)}
            aria-label={color}
          />
        ))}
      </div>

      <div className="color-picker__custom">
        <input
          type="color"
          className="color-picker__native"
          value={value}
          onChange={(e) => handleSelect(e.target.value)}
          onBlur={handleBlurNormalize}
        />
        <input
          type="text"
          className="color-picker__hex input__field"
          value={value}
          onChange={(e) => handleSelect(e.target.value)}
          onBlur={handleBlurNormalize}
          placeholder="#000000"
        />
      </div>

      {meta.touched && meta.error && (
        <p className="input__error">{meta.error}</p>
      )}
    </label>
  )
}

export default ColorPicker
