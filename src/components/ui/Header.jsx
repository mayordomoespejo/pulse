import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LogoTextIcon } from '../../assets/icons/icons'
import { ROUTES_NAMES } from '../../router/routesNames'

import BurgerButton from './BurgerButton'

/**
 * Fixed mobile header with logo and hamburger menu toggle.
 * Hidden on tablet and above (replaced by Navbar).
 *
 * @param {Object} props
 * @param {boolean} props.isMenuOpen
 * @param {Function} props.onToggleMenu
 */
function Header({ isMenuOpen, onToggleMenu }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate(ROUTES_NAMES.ROOT)
  }

  return (
    <header className={`header ${isMenuOpen ? 'header--menu-open' : ''}`}>
      <div className="header__left">
        <button
          type="button"
          className="header__logo-button"
          onClick={handleLogoClick}
          aria-label={t('NAVBAR.GO_TO_HOME')}
        >
          <LogoTextIcon className="header__logo" fill="var(--color-secondary)" />
        </button>
      </div>

      <BurgerButton
        className="header__hamburger"
        isActive={isMenuOpen}
        ariaLabel={t('HEADER.TOGGLE_MENU')}
        ariaControls="app-sidebar"
        onClick={onToggleMenu}
      />
    </header>
  )
}

export default Header
