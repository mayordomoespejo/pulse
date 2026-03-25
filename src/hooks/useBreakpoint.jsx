import { useEffect, useState } from 'react'

const DEFAULT_BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
  desktopLg: 1440,
}

// Module-level MediaQueryList objects — created once for the entire app lifetime.
const mediaQueries = {
  isPhone: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.phone}px) and (max-width: ${DEFAULT_BREAKPOINTS.tablet - 1}px)`),
  isTablet: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.tablet}px)`),
  isDesktop: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.desktop}px)`),
  isDesktopLg: window.matchMedia(`(min-width: ${DEFAULT_BREAKPOINTS.desktopLg}px)`),
}

function getSnapshot() {
  return {
    isPhone: mediaQueries.isPhone.matches,
    isTablet: mediaQueries.isTablet.matches,
    isDesktop: mediaQueries.isDesktop.matches,
    isDesktopLg: mediaQueries.isDesktopLg.matches,
  }
}

// Single set of listeners shared across all hook instances.
const listeners = new Set()

function handleChange() {
  const next = getSnapshot()
  listeners.forEach((cb) => cb(next))
}

Object.values(mediaQueries).forEach((mq) => {
  mq.addEventListener('change', handleChange)
})

/**
 * Reactively tracks the active viewport breakpoint.
 *
 * @returns {{ isPhone: boolean, isTablet: boolean, isDesktop: boolean, isDesktopLg: boolean }}
 */
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(getSnapshot)

  useEffect(() => {
    // Sync in case the viewport changed between render and effect.
    setBreakpoint(getSnapshot())

    listeners.add(setBreakpoint)
    return () => {
      listeners.delete(setBreakpoint)
    }
  }, [])

  return breakpoint
}

export default useBreakpoint
