/**
 * @param {Object} props
 * @param {React.ReactNode} [props.children]
 * @param {string} [props.label] - Text label (alternative to children)
 * @param {Function} [props.onClick]
 * @param {('primary'|'secondary'|'secondary-filled'|'secondary-inverse'|'tertiary'|'remove'|'link')} [props.variant='primary']
 * @param {string} [props.theme] - Alias for variant (legacy)
 * @param {string} [props.type='button']
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className='']
 * @param {string} [props.form]
 * @param {boolean} [props.shadow=false]
 * @param {('xsmall'|'small'|'medium'|'none')} [props.size='medium']
 * @param {React.ReactNode} [props.iconStart]
 * @param {React.ReactNode} [props.iconEnd]
 * @param {boolean} [props.mobileIconOnly=false]
 */
import { memo } from 'react'

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

export default memo(Button)
