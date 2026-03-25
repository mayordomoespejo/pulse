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
  { key: 'SIDEBAR.FAVORITES', path: ROUTES_NAMES.FAVORITES },
  { key: 'SIDEBAR.PROFILE', path: ROUTES_NAMES.PROFILE },
  { key: 'SIDEBAR.LOGOUT', isLogout: true },
]

export const DEFAULT_STALE_TIME = 5 * 60 * 1000
export const DEFAULT_LIMIT = 15
