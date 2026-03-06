import { sizesIconCircle, sizesIconBar } from '../../helpers/theme'
import useBreakpoint from '../../hooks/useBreakpoint'

function PlayerIconWrapper({ Component, isCircle = false, sizeCircle = 'large', className, ...props }) {
  const { isDesktop } = useBreakpoint()
  const breakpoint = isDesktop ? 'desktop' : 'mobile'
  const sizeCircleComponent = sizesIconCircle[sizeCircle][breakpoint]
  const sizeBarComponent = sizesIconBar[breakpoint]

  const size = isCircle ? sizeCircleComponent : sizeBarComponent

  return <Component className={`player-icon-wrapper ${className}`} {...size} {...props} />
}

export default PlayerIconWrapper