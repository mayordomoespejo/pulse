import { useTranslation } from 'react-i18next'

/**
 * SidebarItem - Componente que renderiza una lista de items de navegación del sidebar
 * 
 * Renderiza los items de navegación y aplica la clase 'active' al item correspondiente
 * a la ruta actual basándose en la propiedad active de cada item.
 * 
 * @component
 * @param {Array} navigationItems - Array de items de navegación con propiedad active
 * @param {Function} onMenuClick - Función que se ejecuta al hacer click en un item
 * @returns {JSX.Element} Lista de items de navegación
 */
const SidebarItem = ({
  navigationItems,
  onMenuClick,
}) => {
  const { t } = useTranslation()
  return (
    <nav className="sidebar__navigation">
      <ul>
        {navigationItems.map(item => (
          <li
            key={item.key}
            onClick={() => onMenuClick(item)}
            className={item.active ? 'active' : ''}
          >
            {item?.icon && (
              <span className="sidebar__icon">
                <item.icon />
              </span>
            )}
            <p className="sidebar__label">{t(`${item?.key}`)}</p>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SidebarItem
