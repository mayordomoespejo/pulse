import { ROUTES_NAMES } from '../router/routesNames'

export const PEXELS_URL = 'https://www.pexels.com'
export const PEXELS_API_URL = 'https://api.pexels.com/videos'

/** Shared icon style for circle player controls (play, pause, reload, next, prev). */
export const PLAYER_CIRCLE_ICON_STYLE = {
  stroke: '#FFFFFF',
  colorIcon: '#FFFFFF',
  bg: 'rgba(0, 0, 0, 0.4)',
}

export const SIDEBAR_MENU_ITEMS = [
  { key: 'SIDEBAR.FEATURED', path: ROUTES_NAMES.ROOT },
  { key: 'SIDEBAR.LIBRARY', path: ROUTES_NAMES.VIDEOS },
]

export const DEFAULT_BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
  desktopLg: 1440,
}

export const DEFAULT_LIMIT = 15
