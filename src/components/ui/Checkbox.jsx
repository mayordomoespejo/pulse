import { Field } from 'formik'
import React from 'react'

/**
 * Checkbox reutilizable con integración total con Formik
 *
 * @param {Object}   props
 * @param {string}   props.name             Nombre del campo (requerido por Formik)
 * @param {string}   [props.id]             ID personalizado para el input (opcional)
 * @param {React.ReactNode} props.label     Texto o nodo para la etiqueta
 * @param {boolean} [props.required]        Si es obligatorio (opcional)
 * @param {boolean} [props.disabled]        Si está deshabilitado (opcional)
 * @param {string}  [props.className]       Clases CSS adicionales (opcional)
 *
 * @returns {JSX.Element}
 */

function CheckboxBase({ id, label, required = false, disabled = false, className = '', checked = null, onChange }) {
  const generatedId = React.useId()
  const inputId = id || `checkbox-${generatedId}`

  return (
    <label className={`checkbox ${className}`}>
      <input
        id={inputId}
        type="checkbox"
        checked={Boolean(checked)}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="checkbox__input"
      />
      {label}
    </label>
  )
}

function CheckboxWithFormik({ name, id, label, required = false, disabled = false, className = '' }) {
  const generatedId = React.useId()
  const inputId = id || `checkbox-${generatedId}`

  return (
    <Field name={name} type="checkbox">
      {({ field, meta }) => (
        <label className={`checkbox ${className} ${meta.touched && meta.error && 'checkbox--error'}`}>
          <input
            id={inputId}
            type="checkbox"
            {...field}
            checked={field.value}
            required={required}
            disabled={disabled}
            className="checkbox__input"
          />
          {label}
          {meta.touched && meta.error && (
            <p className="checkbox__error">{meta.error}</p>
          )}
        </label>
      )}
    </Field>
  )
}

function Checkbox({ useFormik = true, ...props }) {
  if (useFormik) return <CheckboxWithFormik {...props} />
  return <CheckboxBase {...props} />
}

export default Checkbox
