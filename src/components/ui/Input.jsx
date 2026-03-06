import { ErrorMessage, Field, useField } from 'formik'
import { useId, useRef, useCallback, forwardRef, isValidElement } from 'react'

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

const buildClassName = (...classes) => classes.filter(Boolean).join(' ')

/**
 * Shared wrapper that renders the label, icon slots, error message and hint.
 *
 * @param {Object} props
 * @param {string} [props.label]
 * @param {string} props.id
 * @param {string} [props.className='']
 * @param {React.ComponentType|React.ReactNode} [props.IconBefore=null]
 * @param {React.ComponentType|React.ReactNode} [props.IconAfter=null]
 * @param {boolean} [props.iconAfterInteractive=false]
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.error]
 * @param {boolean} [props.showError=false]
 * @param {string} props.errorId
 * @param {React.RefObject} props.inputRef
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.variant='secondary']
 * @param {boolean} [props.showPlaceholderHintOnFocus=false]
 * @param {string} [props.placeholderHintText='']
 * @param {string} [props.placeholderHintPrefix='']
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
  const hasError = Boolean(showError && error)
  const variantClass = variant === VARIANTS.PRIMARY ? 'input--primary' : 'input--secondary'
  const containerClassName = buildClassName(
    CSS_CLASSES.input,
    variantClass,
    className,
    hasError ? 'input--error' : ''
  )

  const handleWrapperClick = useCallback(() => {
    if (!disabled && inputRef?.current) {
      inputRef.current.focus()
    }
  }, [disabled, inputRef])

  const placeholderHintLabel = (() => {
    if (!showPlaceholderHintOnFocus || !placeholderHintText) return ''
    return placeholderHintPrefix
      ? `${placeholderHintPrefix} "${placeholderHintText}"`
      : `"${placeholderHintText}"`
  })()

  const renderIcon = (Icon) => isValidElement(Icon) ? Icon : <Icon />

  return (
    <div className={containerClassName}>
      {label && (
        <label className={CSS_CLASSES.label} htmlFor={id}>
          {label}
        </label>
      )}
      <div
        className={CSS_CLASSES.inputWrapper}
        onClick={handleWrapperClick}
        tabIndex={-1}
        aria-disabled={disabled}
      >
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
        <div id={errorId} role="alert" aria-live="polite">
          {error}
        </div>
      )}
      {!hasError && placeholderHintLabel && (
        <p className={CSS_CLASSES.hint} aria-live="polite">
          {placeholderHintLabel}
        </p>
      )}
    </div>
  )
}

/**
 * Input wired to Formik — reads field state and errors from the nearest Formik context.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} [props.label]
 * @param {string} [props.type='text']
 * @param {string} [props.id]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.autoComplete='off']
 * @param {string} [props.autoCorrect='off']
 * @param {string} [props.autoCapitalize='off']
 * @param {boolean} [props.spellCheck=false]
 * @param {string} [props.className='']
 * @param {React.ComponentType|React.ReactNode} [props.IconAfter=null]
 * @param {React.ComponentType|React.ReactNode} [props.IconBefore=null]
 * @param {boolean} [props.iconAfterInteractive=false]
 * @param {string} [props.variant='secondary']
 * @param {boolean} [props.showPlaceholderHintOnFocus=false]
 * @param {string} [props.placeholderHintPrefix='']
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
  const errorId = `${inputId}-error`
  const internalRef = useRef(null)
  const inputRef = ref || internalRef

  const [field, meta] = useField(name)
  const hasError = meta.touched && Boolean(meta.error)

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
      <Field
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        className={CSS_CLASSES.field}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? errorId : undefined}
        innerRef={inputRef}
        {...field}
        {...props}
      />
    </InputWrapper>
  )
})

FormikInput.displayName = 'FormikInput'

/**
 * Uncontrolled / manually-controlled input — no Formik dependency.
 *
 * @param {Object} props
 * @param {string} props.name
 * @param {string} [props.label]
 * @param {string} [props.type='text']
 * @param {string} [props.id]
 * @param {string} [props.placeholder]
 * @param {boolean} [props.required=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.autoComplete='off']
 * @param {string} [props.autoCorrect='off']
 * @param {string} [props.autoCapitalize='off']
 * @param {boolean} [props.spellCheck=false]
 * @param {string} [props.className='']
 * @param {React.ComponentType|React.ReactNode} [props.IconAfter=null]
 * @param {React.ComponentType|React.ReactNode} [props.IconBefore=null]
 * @param {boolean} [props.iconAfterInteractive=false]
 * @param {string} [props.error]
 * @param {boolean} [props.touched=false]
 * @param {string} [props.value]
 * @param {Function} [props.onChange]
 * @param {Function} [props.onBlur]
 * @param {string} [props.variant='secondary']
 * @param {boolean} [props.showPlaceholderHintOnFocus=false]
 * @param {string} [props.placeholderHintPrefix='']
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
  const errorId = `${inputId}-error`
  const internalRef = useRef(null)
  const inputRef = ref || internalRef

  const hasError = touched && Boolean(error)

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
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        className={CSS_CLASSES.field}
        aria-invalid={hasError ? 'true' : undefined}
        aria-describedby={hasError ? errorId : undefined}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
    </InputWrapper>
  )
})

RegularInput.displayName = 'RegularInput'

/**
 * Unified input component. Set `useFormik={false}` for standalone (non-Formik) usage.
 *
 * @param {Object} props
 * @param {boolean} [props.useFormik=true]
 */
const Input = ({ useFormik = true, ...props }) => {
  return useFormik ? <FormikInput {...props} /> : <RegularInput {...props} />
}

Input.displayName = 'Input'

export default Input
