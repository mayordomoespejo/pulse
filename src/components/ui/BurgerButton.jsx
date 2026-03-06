const BurgerButton = ({
  isActive = false,
  onClick,
  ariaLabel,
  ariaControls,
  ariaExpanded,
  className = '',
}) => {
  return (
    <button
      type="button"
      className={`burger-button ${isActive ? 'is-active' : ''} ${className}`.trim()}
      aria-label={ariaLabel}
      aria-expanded={ariaExpanded ?? isActive}
      aria-controls={ariaControls}
      onClick={onClick}
    >
      <span className="burger-button__line" />
      <span className="burger-button__line" />
      <span className="burger-button__line" />
    </button>
  )
}

export default BurgerButton
