/**
 * Componente de botón reutilizable
 * 
 * @param {object} props - Props del componente
 * @param {React.ReactNode} [props.children] - Contenido del botón (nueva forma)
 * @param {string} [props.label] - Texto visible del botón (forma antigua, se mantiene por compatibilidad)
 * @param {Function} [props.onClick] - Función que se ejecuta al hacer click
 * @param {'primary'|'secondary'|'secondary-filled'} [props.variant='primary'] - Variante visual del botón (nueva forma)
 * @param {('primary' | 'secondary' | 'secondary-filled' | 'secondary-inverse' | 'tertiary' | 'remove' | 'link')} [props.theme] - Variante de color del botón (forma antigua, se mantiene por compatibilidad)
 * @param {string} [props.type='button'] - Tipo de botón HTML ('button', 'submit', 'reset')
 * @param {boolean} [props.disabled=false] - Si el botón está deshabilitado
 * @param {string} [props.className=''] - Clases CSS adicionales
 * @param {string} [props.form] - ID del formulario al que pertenece el botón
 * @param {boolean} [props.shadow] - Si se debe mostrar una sombra
 * @param {('xsmall' | 'small' | 'medium' | 'none')} [props.size='medium'] - Tamaño del botón
 * @param {React.ReactNode} [props.iconStart] - Icono que se muestra al inicio del botón
 * @param {React.ReactNode} [props.iconEnd] - Icono que se muestra al final del botón
 * @param {boolean} [props.mobileIconOnly] - Si el botón solo muestra el icono en móvil
 * @returns {JSX.Element} Componente de botón
 * 
 * @example
 * // Nueva forma (recomendada)
 * <Button variant="primary" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * // Forma antigua (mantiene compatibilidad)
 * <Button label="Click me" theme="primary" onClick={handleClick} />
 */
const Button = ({
  children,
  label,
  onClick,
  variant,
  theme,
  type = 'button',
  disabled = false,
  className = '',
  form,
  shadow = false,
  size = 'medium',
  iconStart = null,
  iconEnd = null,
  mobileIconOnly = false,
  ...otherProps
}) => {
  const themeValue = theme || variant || 'primary'
  const buttonContent = children !== undefined ? children : label
  const classes = [
    'button',
    `button--${themeValue}`,
    size && `button--${size}`,
    disabled && 'button--disabled',
    shadow && 'button--box-shadow',
    mobileIconOnly && 'button--mobile-icon-only',
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      form={form}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...otherProps}
    >
      {iconStart && <span className="button__icon">{iconStart}</span>}
      {buttonContent && <span className="button__label">{buttonContent}</span>}
      {iconEnd && <span className="button__icon">{iconEnd}</span>}
    </button>
  )
}

export default Button
