/**
 * Spinner - Círculo giratorio para indicar carga
 *
 * @param {Object}     props
 * @param {'button' | 'small' | 'medium' | 'large'} props.size Tamaño del spinner
 * @param {'center'} props.position Posición del spinner ('center', 'absolute', 'fixed')
 * @param {string} props.fill Color del spinner
 * @param {string} props.slot Slot del spinner
 * @param {string} props.width Ancho del spinner
 * @param {string} props.height Alto del spinner
 * @param {string} props.className Clase adicional opcional
 */

function Spinner({
  width,
  height,
  fill = 'var(--color-secondary)',
  className = '',
  slot,
  size = 'medium',
  position = '',
}) {
  const typeSize = {
    button: 16,
    small: 50,
    medium: 75,
    large: 100,
  }

  const resolvedSize = width || height || typeSize[size]
  const spinnerColor = size === 'button' ? 'var(--color-secondary)' : fill
  const classes = [
    'spinner',
    `spinner--${size}`,
    position && `spinner--${position}`,
    className,
  ].filter(Boolean).join(' ')

  return (
    <div
      className={classes}
      slot={slot}
      style={{
        '--spinner-color': spinnerColor,
        '--spinner-size': `${resolvedSize}px`,
        '--spinner-border': `${Math.max(2, Math.round(resolvedSize / 20))}px`,
      }}
    >
      <span className="spinner__circle" />
    </div>
  )
}

export default Spinner
