import { useEffect, useState } from 'react'

const DEFAULT_BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
  desktopLg: 1440,
}

/**
 * Reactively tracks the active viewport breakpoint.
 *
 * @returns {{ isPhone: boolean, isTablet: boolean, isDesktop: boolean, isDesktopLg: boolean }}
 */
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState({
    isPhone: false,
    isTablet: false,
    isDesktop: false,
    isDesktopLg: false,
  })

  useEffect(() => {
    const mediaQueries = {
      isPhone: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.phone}px) and (max-width: ${DEFAULT_BREAKPOINTS.tablet - 1}px)`),
      isTablet: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.tablet}px)`),
      isDesktop: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.desktop}px)`),
      isDesktopLg: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.desktopLg}px)`),
    }

    const handleChange = () => {
      setBreakpoint({
        isPhone: mediaQueries.isPhone.matches,
        isTablet: mediaQueries.isTablet.matches,
        isDesktop: mediaQueries.isDesktop.matches,
        isDesktopLg: mediaQueries.isDesktopLg.matches,
      })
    }

    setBreakpoint({
      isPhone: mediaQueries.isPhone.matches,
      isTablet: mediaQueries.isTablet.matches,
      isDesktop: mediaQueries.isDesktop.matches,
      isDesktopLg: mediaQueries.isDesktopLg.matches,
    })

    Object.values(mediaQueries).forEach((mediaQuery) => {
      mediaQuery.addEventListener('change', handleChange)
    })

    return () => {
      Object.values(mediaQueries).forEach((mediaQuery) => {
        mediaQuery.removeEventListener('change', handleChange)
      })
    }
  }, [])

  return breakpoint
}

export default useBreakpoint
