import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

import { LogoIcon, LogoTextIcon, LogoutIcon } from '../../assets/icons/icons'
import useBreakpoint from '../../hooks/useBreakpoint'
import { ROUTES_NAMES } from '../../router/routesNames'

import Button from './Button'
import LanguageToggleButton from './LanguageToggleButton'

/**
 * Desktop navigation bar with logo, nav links, language toggle, and logout.
 * Hidden on mobile (replaced by Header + Sidebar).
 *
 * @param {Object} props
 * @param {Function} [props.onNavClick] - Called with the target path on nav link click.
 * @param {Function} props.onMenuClick - Called with `{ isLogout: true }` on logout.
 * @returns {JSX.Element}
 */
function Navbar({ onNavClick, onMenuClick }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { isDesktop } = useBreakpoint()

  const navItems = useMemo(() => [
    {
      key: 'FEATURED',
      path: ROUTES_NAMES.ROOT,
      label: t('SIDEBAR.FEATURED'),
    },
    {
      key: 'LIBRARY',
      path: ROUTES_NAMES.VIDEOS,
      label: t('NAVBAR.LIBRARY'),
    },
  ], [t])

  const handleLogoClick = () => {
    navigate(ROUTES_NAMES.ROOT)
  }

  const handleNavClick = (path) => {
    if (onNavClick) {
      onNavClick(path)
      return
    }

    navigate(path)
  }

  return (
    <nav className="navbar">
      <button
        type="button"
        className="navbar__logo"
        onClick={handleLogoClick}
        aria-label={t('NAVBAR.GO_TO_HOME')}
      >
        {isDesktop
          ? <LogoTextIcon className="navbar__logo-text-icon" fill="var(--color-secondary)" />
          : <LogoIcon className="navbar__logo-icon" fill="var(--color-secondary)" />}
      </button>
      <div className="navbar__right">
        {navItems.map((item) => {
          const isActive = item.path === ROUTES_NAMES.VIDEOS
            ? location.pathname === ROUTES_NAMES.VIDEOS || location.pathname.startsWith('/video/')
            : location.pathname === item.path

          return (
            <div key={item.key} className="navbar__button-wrapper">
              <Button
                label={item.label}
                variant="tertiary"
                size="medium"
                onClick={() => handleNavClick(item.path)}
                className={`navbar__button ${isActive ? 'navbar__button--active' : ''}`}
              />
            </div>
          )
        })}
        <LanguageToggleButton className="navbar__language-button" />
        <Button
          type="button"
          variant="tertiary"
          className="navbar__logout-button"
          onClick={() => onMenuClick?.({ isLogout: true })}
          aria-label={t('SIDEBAR.LOGOUT')}
        >
          <LogoutIcon />
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
