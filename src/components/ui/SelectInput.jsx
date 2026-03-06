'use client'

import { useField } from 'formik'
import { useTranslation } from 'react-i18next'
import Select, { components } from 'react-select'

import { CrossCircleIcon, SelectIcon } from '../../assets/icons/icons'

const DropdownIndicator = (props) => {
  const { IconComponent } = props || {}

  return (
    <components.DropdownIndicator {...props}>
      <IconComponent stroke="currentColor" />
    </components.DropdownIndicator>
  )
}

const ClearIndicator = (props) => {
  return (
    <components.ClearIndicator {...props}>
      <CrossCircleIcon stroke="currentColor" />
    </components.ClearIndicator>
  )
}

/**
 * Componente SelectInput
 * @param {object} props
 * @param {string} props.name - Nombre del input select.
 * @param {string} props.classNamePrefix - Prefijo de las clases del input select.
 * @param {string} props.className - Clase personalizada del input select.
 * @param {Array} props.options - Opciones del input select.
 * @param {string} props.placeholder - Texto de placeholder del input select.
 * @param {('primary'|'secondary')} props.typeStyled - Estilo visual del input select.
 * @param {string} props.label - Etiqueta del input select.
 * @param {object} props.componentsOverride - Componentes personalizados del input select.
 * @param {boolean} [props.useFormik=true] - Cuando es true, usa Formik. Cuando es false, funciona en modo standalone.
 * @param {object} [props.value] - Valor del select cuando no se usa Formik.
 * @param {function} [props.onChange] - onChange controlado cuando no se usa Formik. Recibe (option).
 * @param {boolean} [props.touched] - Estado touched cuando no se usa Formik.
 * @param {string} [props.error] - Mensaje de error cuando no se usa Formik.
 * 
 * @returns {JSX.Element} El elemento del input select.
 * 
 * @example
 * <SelectInput
 *  name="select"
 *  classNamePrefix="my-custom-class"
 *  className="my-custom-class"
 *  options={options}
 *  placeholder="Seleccionar..."
 *  typeStyled="primary"
 *  label="Seleccionar"
 *  componentsOverride={componentsOverride}
 *  useFormik={false}
 *  value={value}
 *  onChange={(opt) => setValue(opt)}
 *  touched={touched}
 *  error={error}
 * />
 * 
 **/
function SelectInputBase({
  name,
  classNamePrefix,
  className,
  options,
  placeholder,
  typeStyled = 'primary',
  label,
  componentsOverride,
  IconComponent = SelectIcon,
  disabled = false,
  touched = false,
  error,
  value,
  onChange,
  ...props
}) {
  const { t } = useTranslation()
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })

  const hasError = Boolean(touched && error)
  const colorError = 'var(--color-error)'

  const selectStyles = {
    primary: 'select-primary',
    secondary: 'select-secondary',
  }
  const selectInlineStyles = {
    valueContainer: (base) => ({ ...base, padding: 0 }),
    inputContainer: (base) => ({ ...base, margin: 0, padding: 0 }),
    indicatorsContainer: (base) => ({ ...base, padding: 0 }),
    dropdownIndicator: (base) => ({ ...base, padding: 0 }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      backgroundColor: 'var(--color-primary)',
      border: '1px solid var(--color-tertiary)',
    }),
    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
    option: (base, state) => ({
      ...base,
      color: state.isSelected ? 'var(--color-primary)' : 'var(--color-tertiary)',
      backgroundColor: state.isSelected
        ? 'var(--color-tertiary)'
        : state.isFocused
          ? 'rgba(0, 0, 0, 0.05)'
          : 'transparent',
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: 0,
      color: 'var(--color-secondary)',
      backgroundColor: 'transparent',
    }),
    multiValueRemove: (base) => ({
      ...base,
      padding: 0,
      color: 'var(--color-secondary)',
      backgroundColor: 'transparent',
    }),
  }
  const menuPortalTarget = typeof window !== 'undefined' ? document.body : null

  const CustomDropdownIndicator = (props) => (
    <DropdownIndicator {...props} IconComponent={IconComponent} />
  )

  return (
    <div data-select-name={name} className={`select-input ${selectStyles[typeStyled]} ${hasError && 'select-input--error'} ${className}`}>
      {label && <label className={`select-input__label ${selectStyles[typeStyled]}__label`}>{label}</label>}
      <Select
        name={name}
        classNamePrefix={`${classNamePrefix} select`}
        className={`select ${disabled && 'select--disabled'}`}
        isDisabled={disabled}
        styles={selectInlineStyles}
        menuPortalTarget={menuPortalTarget}
        menuPosition="fixed"
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator: CustomDropdownIndicator,
          ClearIndicator: ClearIndicator,
          ...componentsOverride,
        }}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        noOptionsMessage={() => CONSTANTS.SELECT_NO_OPTIONS}
        {...{ colorError: colorError, touched, error }}
        {...props}
      />
      {hasError && <p className="select-input__error-msg">{error}</p>}
    </div>
  )
}

function SelectInputWithFormik({ name, ...restProps }) {
  const [, meta, helpers] = useField(name)
  const { setTouched, setValue } = helpers

  const handleChange = (option) => {
    setValue(option ? option : { label: '', value: '' })
    setTouched(name, false)
  }

  return (
    <SelectInputBase
      name={name}
      value={meta?.value}
      touched={meta?.touched}
      error={meta?.error}
      onChange={handleChange}
      {...restProps}
    />
  )
}

function SelectInput({ useFormik = true, ...props }) {
  if (useFormik) {
    return <SelectInputWithFormik {...props} />
  }
  return <SelectInputBase {...props} />
}

export default SelectInput
