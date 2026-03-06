import { ROUTES_NAMES } from '../router/routesNames'

export const SIDEBAR_MENU_ITEMS = [
  { key: 'SIDEBAR.FEATURED', path: ROUTES_NAMES.ROOT },
  { key: 'SIDEBAR.LIBRARY', path: ROUTES_NAMES.VIDEOS },
]

export const DEFAULT_VIDEO_THUMBNAIL = `${import.meta.env.BASE_URL}images/default-thumbnail.png`

export const DEFAULT_BREAKPOINTS = {
  phone: 0,
  tablet: 768,
  desktop: 1024,
  desktopLg: 1440,
}

export const DEFAULT_LIMIT = 15
