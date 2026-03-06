import { useTranslation } from 'react-i18next'

import Button from './Button'
import LanguageToggleButton from './LanguageToggleButton'
import SidebarItem from './SidebarItem'

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
