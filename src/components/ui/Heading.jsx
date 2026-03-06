import { ArrowLongIcon, ArrowShortIcon } from '../../assets/icons/icons'
import useBreakpoint from '../../hooks/useBreakpoint'

import BackButton from './BackButton'

export const ALLOWED_TAGS = { h1: true, h2: true, h3: true }

export const SIZE_CLASSES = {
  h1: 'heading--h1',
  h2: 'heading--h2',
  h3: 'heading--h3',
}

export const COLOR_TOKENS = {
  primary: '#20272F',
  secondary: '#ffffff',
}

/**
 * @param {Object} props
 * @param {'h1'|'h2'|'h3'|'h4'|'h5'} [props.as='h2'] - HTML tag to use for the heading
 * @param {'left'|'center'|'right'} [props.align='left']
 * @param {string} [props.className]
 * @param {{
 *   fontSize?: { phone?: number, desktop?: number },
 *   fontWeight?: { phone?: number, desktop?: number },
 *   lineHeight?: { phone?: number, desktop?: number }
 * }} [props.responsiveStyles]
 * @param {string} [props.color] - Color token for the heading
 * @param {string} [props.title] - Título del encabezado
 * @param {boolean} [props.back=false] - Muestra botón de volver en h2
 * @param {boolean} [props.showArrow=false] - Muestra flecha decorativa a la izquierda del título
 * @returns {JSX.Element}
 */

function Heading({
  as = 'h1',
  align = 'left',
  className = '',
  responsiveStyles = {},
  color = 'var(--color-tertiary)',
  title,
  back = false,
  showArrow = false,
  children,
  ...props
}) {
  const { isPhone, isTablet, isDesktop } = useBreakpoint()
  const Tag = ALLOWED_TAGS[as] ? as : 'h2'
  const sizeClass = SIZE_CLASSES[as] || SIZE_CLASSES.h2
  const alignClass = `heading--${align}`
  const ArrowIcon = isPhone ? ArrowShortIcon : ArrowLongIcon

  const { fontSize, fontWeight, lineHeight } = responsiveStyles || {}

  const style = {
    ...(fontSize &&
      ((isDesktop && fontSize.desktop) || (isTablet && fontSize.tablet) || (isPhone && fontSize.phone)) && {
      '--heading-font-size': `${isDesktop ? fontSize.desktop : fontSize.phone}px`,
    }),
    ...(fontWeight &&
      ((isDesktop && fontWeight.desktop) || (isTablet && fontWeight.tablet) || (isPhone && fontWeight.phone)) && {
      '--heading-font-weight': isDesktop ? fontWeight.desktop : fontWeight.phone,
    }),
    ...(lineHeight &&
      ((isDesktop && lineHeight.desktop) || (isTablet && lineHeight.tablet) || (isPhone && lineHeight.phone)) && {
      '--heading-line-height': isDesktop ? lineHeight.desktop : lineHeight.phone,
    }),
    ...(color && { '--heading-color': color }),

  }

  if (!title) {
    return null
  }

  return (
    <Tag
      className={`heading 
        ${sizeClass}
         ${alignClass}
         ${className}`}
      style={style}
      {...props}
    >
      {(as === 'h2' || showArrow) && (
        back
          ? <BackButton />
          : <ArrowIcon
            className="heading__arrow"
            width={isPhone ? '40px' : '100px'}
            height="auto"
            fill="currentColor"
          />
      )}
      <span className="heading__text">{title}</span>
      {children}
    </Tag>
  )
}

export default Heading
