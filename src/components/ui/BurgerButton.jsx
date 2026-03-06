/**
 * Animated hamburger toggle button with ARIA support.
 *
 * @param {Object} props
 * @param {boolean} [props.isActive=false] - Drives the active (X) state.
 * @param {Function} props.onClick
 * @param {string} props.ariaLabel
 * @param {string} [props.ariaControls] - ID of the element this button controls.
 * @param {boolean} [props.ariaExpanded] - Defaults to `isActive` if not provided.
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
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
