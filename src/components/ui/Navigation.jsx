import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { SIDEBAR_MENU_ITEMS } from '../../constants/constants'
import useBreakpoint from '../../hooks/useBreakpoint'
import { ROUTES_NAMES } from '../../router/routesNames'
import { useAuthStore } from '../../stores/authStore'

import Header from './Header'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

/**
 * Top-level navigation controller.
 * Renders Header + Sidebar on mobile, Navbar on tablet+.
 * Handles logout, route navigation, and mobile menu state.
 *
 * @returns {JSX.Element}
 */
function Navigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isPhone } = useBreakpoint()
  const { signOut } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const baseItems = useMemo(() =>
    SIDEBAR_MENU_ITEMS.map((item) => {
      const isActive = item.path === ROUTES_NAMES.VIDEOS
        ? location.pathname === ROUTES_NAMES.VIDEOS || location.pathname.startsWith('/video/')
        : location.pathname === item.path

      return {
        ...item,
        active: isActive,
      }
    }), [location.pathname])

  const handleMenuClick = async (item) => {
    if (item?.isLogout) {
      await signOut().catch(() => {})
      navigate(ROUTES_NAMES.LOGIN)
      return
    }

    if (item?.path) {
      navigate(item.path)
    }

    if (isPhone) {
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <>
      {isPhone && (
        <Header
          isMenuOpen={isMobileMenuOpen}
          onToggleMenu={() => setIsMobileMenuOpen((prev) => !prev)}
        />
      )}

      {!isPhone && (
        <Navbar onNavClick={navigate} onMenuClick={handleMenuClick} />
      )}

      {isPhone && (
        <Sidebar
          className="main-layout__sidebar"
          menuItems={baseItems}
          isMobileOpen={isMobileMenuOpen}
          onMenuClick={handleMenuClick}
        />
      )}
    </>
  )
}

export default Navigation
