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
