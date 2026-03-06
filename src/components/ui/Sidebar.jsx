import { useTranslation } from 'react-i18next'

import Button from './Button'
import LanguageToggleButton from './LanguageToggleButton'
import SidebarItem from './SidebarItem'

/**
 * Mobile slide-in sidebar with navigation items, language toggle, and logout.
 * Shown only on mobile (tablet+ uses Navbar).
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {Array<{key: string, path: string, active: boolean}>} props.menuItems
 * @param {boolean} props.isMobileOpen - Controls the slide-in open state.
 * @param {Function} props.onMenuClick - Called with the clicked item or `{ isLogout: true }`.
 * @returns {JSX.Element}
 */
function Sidebar({
  className,
  menuItems,
  isMobileOpen,
  onMenuClick,
}) {
  const { t } = useTranslation()

  return (
    <aside
      className={`sidebar ${className} ${isMobileOpen && 'sidebar--mobile-open'}`}
    >
      <div className="sidebar__buttons">
        <SidebarItem
          navigationItems={menuItems}
          onMenuClick={onMenuClick}
        />

        <div className="sidebar__bottom-actions">
          <LanguageToggleButton className="sidebar__language-button" />
          <Button
            className="sidebar__logout"
            label={t('SIDEBAR.LOGOUT')}
            onClick={() => onMenuClick({ isLogout: true })}
            variant="secondary"
          />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
