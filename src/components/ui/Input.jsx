import { ErrorMessage, Field, useField } from 'formik'
import { useId, useRef, useMemo, useCallback, forwardRef, isValidElement } from 'react'

const CSS_CLASSES = {
  input: 'input',
  label: 'input__label',
  inputWrapper: 'input__input-wrapper',
  field: 'input__field',
  iconBefore: 'input__icon-before',
  iconAfter: 'input__icon-after',
  error: 'input__error',
  hint: 'input__hint',
}

const VARIANTS = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
}

const DEFAULT_INPUT_BEHAVIOR = {
  autoComplete: 'off',
  autoCorrect: 'off',
  autoCapitalize: 'off',
  spellCheck: false,
}

/**
 * Construye clases CSS de manera más limpia
 * 
 * Evita concatenaciones manuales y mejora la legibilidad.
 * Filtra valores falsy (null, undefined, '') antes de unir las clases.
 * 
 * @param {...string} classes - Clases CSS a combinar
 * @returns {string} String con las clases combinadas y filtradas
 */
const buildClassName = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

const buildBaseInputProps = ({
  ref,
  id,
  name,
  type,
  placeholder,
  required,
  disabled,
  autoComplete,
  autoCorrect,
  autoCapitalize,
  spellCheck,
  hasError,
  ariaDescribedBy,
  className,
  extraProps,
}) => {
  const baseProps = {
    id,
    name,
    type,
    placeholder,
    required,
    disabled,
    autoComplete,
    autoCorrect,
    autoCapitalize,
    spellCheck,
    className,
    'aria-invalid': hasError ? 'true' : undefined,
    'aria-describedby': ariaDescribedBy,
    ...extraProps,
  }

  if (ref) {
    baseProps.ref = ref
  }

  return baseProps
}

/**
 * InputWrapper - Componente wrapper reutilizable para inputs
 * 
 * Maneja la estructura común: label, wrapper, iconos y errores.
 * Este componente encapsula toda la lógica de presentación y accesibilidad.
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} [props.label] - Etiqueta del input
 * @param {string} props.id - ID único del input (para asociar label)
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {React.ComponentType|React.ReactNode} [props.IconBefore=null] - Componente o nodo de icono antes del input
 * @param {React.ComponentType|React.ReactNode} [props.IconAfter=null] - Componente o nodo de icono después del input
 * @param {React.ReactNode} props.children - Contenido del input (el elemento input real)
 * @param {React.ReactNode} [props.error] - Mensaje de error a mostrar
 * @param {boolean} [props.showError=false] - Si debe mostrarse el error
 * @param {string} props.errorId - ID del elemento de error (para aria-describedby)
 * @param {React.RefObject} props.inputRef - Referencia al elemento input
 * @param {boolean} [props.disabled=false] - Si el input está deshabilitado
 * @param {string} [props.variant='secondary'] - Variante de estilo ('primary' | 'secondary')
 */
const InputWrapper = ({
  label,
  id,
  className = '',
  IconBefore = null,
  IconAfter = null,
  iconAfterInteractive = false,
  children,
  error,
  showError,
  errorId,
  inputRef,
  disabled = false,
  variant = VARIANTS.SECONDARY,
  showPlaceholderHintOnFocus = false,
  placeholderHintText = '',
  placeholderHintPrefix = '',
}) => {
  const hasError = useMemo(() => Boolean(showError && error), [showError, error])

  const variantClass = useMemo(() => {
    return variant === VARIANTS.PRIMARY ? 'input--primary' : 'input--secondary'
  }, [variant])

  const containerClassName = useMemo(() => {
    return buildClassName(
      CSS_CLASSES.input,
      variantClass,
      className,
      hasError ? 'input--error' : ''
    )
  }, [variantClass, className, hasError])

  const handleWrapperClick = useCallback(() => {
    if (!disabled && inputRef?.current) {
      inputRef.current.focus()
    }
  }, [disabled, inputRef])

  const wrapperProps = useMemo(() => ({
    className: CSS_CLASSES.inputWrapper,
    onClick: handleWrapperClick,
    tabIndex: -1,
    'aria-disabled': disabled,
  }), [handleWrapperClick, disabled])

  const placeholderHintLabel = useMemo(() => {
    if (!showPlaceholderHintOnFocus || !placeholderHintText) {
      return ''
    }

    return placeholderHintPrefix
      ? `${placeholderHintPrefix} "${placeholderHintText}"`
      : `"${placeholderHintText}"`
  }, [placeholderHintPrefix, placeholderHintText, showPlaceholderHintOnFocus])

  const renderIcon = useCallback((Icon) => {
    return isValidElement(Icon) ? Icon : <Icon />
  }, [])

  return (
    <div className={containerClassName}>
      {label && (
        <label className={CSS_CLASSES.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div {...wrapperProps}>
        {IconBefore && (
          <div className={CSS_CLASSES.iconBefore} aria-hidden="true">
            {renderIcon(IconBefore)}
          </div>
        )}
        {children}
        {IconAfter && (
          <div
            className={buildClassName(
              CSS_CLASSES.iconAfter,
              iconAfterInteractive ? 'input__icon-after--interactive' : ''
            )}
            aria-hidden={!iconAfterInteractive}
          >
            {renderIcon(IconAfter)}
          </div>
        )}
      </div>
      {hasError && (
        <div
          id={errorId}
          role="alert"
          aria-live="polite"
        >
          {error}
        </div>
      )}
      {!hasError && placeholderHintLabel && (
        <p
          className={buildClassName(CSS_CLASSES.hint)}
          aria-live="polite"
        >
          {placeholderHintLabel}
        </p>
      )}
    </div>
  )
}

/**
 * FormikInput - Input integrado con Formik
 * 
 * Maneja automáticamente el estado, validación y errores de Formik.
 * Este componente se integra directamente con el contexto de Formik usando useField.
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} props.name - Nombre del campo en Formik (requerido)
 * @param {string} [props.label] - Etiqueta del input
 * @param {string} [props.type='text'] - Tipo de input HTML
 * @param {string} [props.id] - ID único del input (se genera automáticamente si no se proporciona)
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.required=false] - Si el campo es requerido
 * @param {boolean} [props.disabled=false] - Si el input está deshabilitado
 * @param {string} [props.autoComplete='off'] - Valor de autocompletado HTML
 * @param {string} [props.autoCorrect='off'] - Autocorrección del navegador
 * @param {string} [props.autoCapitalize='off'] - Autocapitalización del navegador
 * @param {boolean} [props.spellCheck=false] - Corrector ortográfico del navegador
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {React.ComponentType|React.ReactNode} [props.IconAfter=null] - Componente o nodo de icono después del input
 * @param {React.ComponentType|React.ReactNode} [props.IconBefore=null] - Componente o nodo de icono antes del input
 * @param {string} [props.variant='secondary'] - Variante de estilo ('primary' | 'secondary')
 * @param {...Object} props - Props adicionales que se pasan al Field de Formik
 */
const FormikInput = forwardRef(({
  name,
  label,
  type = 'text',
  id,
  placeholder,
  required = false,
  disabled = false,
  autoComplete = DEFAULT_INPUT_BEHAVIOR.autoComplete,
  autoCorrect = DEFAULT_INPUT_BEHAVIOR.autoCorrect,
  autoCapitalize = DEFAULT_INPUT_BEHAVIOR.autoCapitalize,
  spellCheck = DEFAULT_INPUT_BEHAVIOR.spellCheck,
  className = '',
  IconAfter = null,
  iconAfterInteractive = false,
  IconBefore = null,
  variant = VARIANTS.SECONDARY,
  showPlaceholderHintOnFocus = false,
  placeholderHintPrefix = '',
  ...props
}, ref) => {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = useMemo(() => `${inputId}-error`, [inputId])

  const internalRef = useRef(null)
  const inputRef = ref || internalRef

  const [field, meta] = useField(name)

  const hasError = useMemo(() => meta.touched && Boolean(meta.error), [meta.touched, meta.error])

  const ariaDescribedBy = useMemo(() => {
    return hasError ? errorId : undefined
  }, [hasError, errorId])

  const fieldProps = useMemo(() => buildBaseInputProps({
    ref: undefined,
    id: inputId,
    name,
    type,
    placeholder,
    required,
    disabled,
    autoComplete,
    autoCorrect,
    autoCapitalize,
    spellCheck,
    hasError,
    ariaDescribedBy,
    className: CSS_CLASSES.field,
    extraProps: {
      innerRef: inputRef,
      ...field,
      ...props,
    },
  }), [
    inputRef,
    inputId,
    name,
    type,
    placeholder,
    required,
    disabled,
    autoComplete,
    autoCorrect,
    autoCapitalize,
    spellCheck,
    hasError,
    ariaDescribedBy,
    field,
    props,
  ])

  return (
    <InputWrapper
      label={label}
      id={inputId}
      className={className}
      IconBefore={IconBefore}
      IconAfter={IconAfter}
      iconAfterInteractive={iconAfterInteractive}
      error={<ErrorMessage name={name} component="p" className={CSS_CLASSES.error} />}
      showError={hasError}
      errorId={errorId}
      inputRef={inputRef}
      disabled={disabled}
      variant={variant}
      showPlaceholderHintOnFocus={showPlaceholderHintOnFocus}
      placeholderHintText={placeholder}
      placeholderHintPrefix={placeholderHintPrefix}
    >
      <Field {...fieldProps} />
    </InputWrapper>
  )
})

FormikInput.displayName = 'FormikInput'

/**
 * RegularInput - Input sin Formik
 * 
 * Requiere manejo manual de estado y validación.
 * Útil cuando no se usa Formik o se necesita control total sobre el estado.
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {string} props.name - Nombre del campo
 * @param {string} [props.label] - Etiqueta del input
 * @param {string} [props.type='text'] - Tipo de input HTML
 * @param {string} [props.id] - ID único del input (se genera automáticamente si no se proporciona)
 * @param {string} [props.placeholder] - Texto placeholder
 * @param {boolean} [props.required=false] - Si el campo es requerido
 * @param {boolean} [props.disabled=false] - Si el input está deshabilitado
 * @param {string} [props.autoComplete='off'] - Valor de autocompletado HTML
 * @param {string} [props.autoCorrect='off'] - Autocorrección del navegador
 * @param {string} [props.autoCapitalize='off'] - Autocapitalización del navegador
 * @param {boolean} [props.spellCheck=false] - Corrector ortográfico del navegador
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {React.ComponentType|React.ReactNode} [props.IconAfter=null] - Componente o nodo de icono después del input
 * @param {React.ComponentType|React.ReactNode} [props.IconBefore=null] - Componente o nodo de icono antes del input
 * @param {string} [props.error] - Mensaje de error a mostrar
 * @param {boolean} [props.touched=false] - Si el campo ha sido tocado/interactuado
 * @param {string} [props.value] - Valor controlado del input
 * @param {Function} [props.onChange] - Handler para cambios
 * @param {Function} [props.onBlur] - Handler para blur
 * @param {string} [props.variant='secondary'] - Variante de estilo ('primary' | 'secondary')
 * @param {...Object} props - Props adicionales que se pasan al elemento input
 */
const RegularInput = forwardRef(({
  name,
  label,
  type = 'text',
  id,
  placeholder,
  required = false,
  disabled = false,
  autoComplete = DEFAULT_INPUT_BEHAVIOR.autoComplete,
  autoCorrect = DEFAULT_INPUT_BEHAVIOR.autoCorrect,
  autoCapitalize = DEFAULT_INPUT_BEHAVIOR.autoCapitalize,
  spellCheck = DEFAULT_INPUT_BEHAVIOR.spellCheck,
  className = '',
  IconAfter = null,
  iconAfterInteractive = false,
  IconBefore = null,
  error,
  touched = false,
  value,
  onChange,
  onBlur,
  variant = VARIANTS.SECONDARY,
  showPlaceholderHintOnFocus = false,
  placeholderHintPrefix = '',
  ...props
}, ref) => {
  const generatedId = useId()
  const inputId = id || generatedId
  const errorId = useMemo(() => `${inputId}-error`, [inputId])

  const internalRef = useRef(null)
  const inputRef = ref || internalRef

  const hasError = useMemo(() => touched && Boolean(error), [touched, error])

  const ariaDescribedBy = useMemo(() => {
    return hasError ? errorId : undefined
  }, [hasError, errorId])

  const inputProps = useMemo(() => buildBaseInputProps({
    ref: inputRef,
    id: inputId,
    name,
    type,
    placeholder,
    required,
    disabled,
    autoComplete,
    autoCorrect,
    autoCapitalize,
    spellCheck,
    hasError,
    ariaDescribedBy,
    className: CSS_CLASSES.field,
    extraProps: {
      value,
      onChange,
      onBlur,
      ...props,
    },
  }), [
    inputRef,
    inputId,
    name,
    type,
    placeholder,
    required,
    disabled,
    autoComplete,
    autoCorrect,
    autoCapitalize,
    spellCheck,
    value,
    onChange,
    onBlur,
    hasError,
    ariaDescribedBy,
    props,
  ])

  return (
    <InputWrapper
      label={label}
      id={inputId}
      className={className}
      IconBefore={IconBefore}
      IconAfter={IconAfter}
      iconAfterInteractive={iconAfterInteractive}
      error={error && <p className={CSS_CLASSES.error}>{error}</p>}
      showError={hasError}
      errorId={errorId}
      inputRef={inputRef}
      disabled={disabled}
      variant={variant}
      showPlaceholderHintOnFocus={showPlaceholderHintOnFocus}
      placeholderHintText={placeholder}
      placeholderHintPrefix={placeholderHintPrefix}
    >
      <input {...inputProps} />
    </InputWrapper>
  )
})

RegularInput.displayName = 'RegularInput'

/**
 * Input - Componente principal de input
 * 
 * Soporta tanto Formik como inputs regulares mediante la prop `useFormik`.
 * Este componente actúa como un wrapper inteligente que decide qué implementación usar.
 * 
 * @component
 * @param {Object} props - Props del componente
 * @param {boolean} [props.useFormik=true] - Si es true, usa FormikInput; si es false, usa RegularInput
 * @param {...Object} props - Todas las demás props se pasan al componente seleccionado
 * @returns {React.ReactElement} - El componente Input apropiado según useFormik
 * 
 * @example
 * // Con Formik (por defecto)
 * <Input name="email" label="Email" />
 * 
 * @example
 * // Sin Formik
 * <Input 
 *   useFormik={false}
 *   name="email"
 *   label="Email"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 * />
 */
const Input = ({ useFormik = true, ...props }) => {
  return useFormik ? <FormikInput {...props} /> : <RegularInput {...props} />
}

Input.displayName = 'Input'

export default Input
