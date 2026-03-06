/**
 * Animated vertical gradient bar driven by CSS custom properties.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {number} [props.width=27] - Bar width in px.
 * @param {number} [props.height=300] - Bar height in px.
 * @param {number} [props.duration=6] - Animation cycle duration in seconds.
 * @returns {JSX.Element}
 */
function GradientBar({
  className = '',
  width = 27,
  height = 300,
  duration = 6,
}) {
  return (
    <div
      className={`gradient-bar ${className}`}
      style={{
        '--gb-w': `${width}px`,
        '--gb-h': `${height}px`,
        '--gb-cycle': `${height}px`,
        '--gb-duration': `${duration}s`,
      }}
    />
  )
}

export default GradientBar
