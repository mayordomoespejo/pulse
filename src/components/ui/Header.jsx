import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { LogoTextIcon } from '../../assets/icons/icons'
import { ROUTES_NAMES } from '../../router/routesNames'

import BurgerButton from './BurgerButton'

/**
 * Header - Componente de encabezado para móvil
 * 
 * Muestra el header con logo y botón hamburguesa para abrir/cerrar el sidebar.
 * Solo se muestra en dispositivos móviles.
 * 
 * @component
 * @param {boolean} isMenuOpen - Estado del menú móvil (abierto/cerrado)
 * @param {Function} onToggleMenu - Función para alternar el estado del menú móvil
 * @returns {JSX.Element} Header con logo y botón hamburguesa
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
