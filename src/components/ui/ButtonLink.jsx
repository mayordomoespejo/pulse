import { Link } from 'react-router-dom'

/**
 * Botón de enlace reutilizable con estilos según color y tamaño
 *
 * @param {Object}   props
 * @param {string}   props.label       Texto visible del botón
 * @param {string}   props.url         URL a la que navega el botón
 * @param {string}   [props.className] Clases CSS adicionales (opcional)
 * @param {string}   [props.target]    Valor del atributo target (por defecto: '_blank')
 * @param {('primary' | 'secondary' | 'tertiary' | 'danger')}   [props.theme]     Variante de color del botón ('primary', 'secondary')
 * @param {('small' | 'medium' | 'none')}   [props.size]      Tamaño del botón ('small', 'medium') (por defecto: 'small')
 *
 * @returns {JSX.Element|null} Botón estilizado como enlace o `null` si faltan `label` o `url`
 */

function ButtonLink({
  label,
  href,
  className = '',
  target = '_blank',
  theme = 'primary',
  size = 'small',
  iconStart = null,
  iconEnd = null,
  onClick = null,
}) {

  return (
    <Link
      className={`button button--${theme} button--${size} ${className}`}
      to={href}
      target={target}
      rel="noopener noreferrer"
      onClick={onClick}
    >
      {iconStart && <span className="button__icon">{iconStart}</span>}
      {label && <span className="button__label">{label}</span>}
      {iconEnd && <span className="button__icon">{iconEnd}</span>}
    </Link>
  )
}

export default ButtonLink
