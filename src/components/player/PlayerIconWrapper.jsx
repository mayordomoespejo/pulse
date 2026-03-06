import { sizesIconCircle, sizesIconBar } from '../../helpers/theme'
import useBreakpoint from '../../hooks/useBreakpoint'

/**
 * Responsive icon size wrapper for player controls.
 * Applies breakpoint-aware dimensions from theme constants.
 *
 * @param {Object} props
 * @param {React.ElementType} props.Component - Icon component to render.
 * @param {boolean} [props.isCircle=false] - Uses circle sizes when true, bar sizes otherwise.
 * @param {'large'|'small'} [props.sizeCircle='large'] - Size key for circle icons.
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
function PlayerIconWrapper({ Component, isCircle = false, sizeCircle = 'large', className, ...props }) {
  const { isDesktop } = useBreakpoint()
  const breakpoint = isDesktop ? 'desktop' : 'mobile'
  const sizeCircleComponent = sizesIconCircle[sizeCircle][breakpoint]
  const sizeBarComponent = sizesIconBar[breakpoint]

  const size = isCircle ? sizeCircleComponent : sizeBarComponent

  return <Component className={`player-icon-wrapper ${className}`} {...size} {...props} />
}

export default PlayerIconWrapper