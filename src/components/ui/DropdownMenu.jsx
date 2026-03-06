import { useState, useRef, useEffect } from 'react'

/**
 * DropdownMenu - Menú contextual con opciones desplegables
 *
 * Muestra un icono de "dropdown" (tres puntos verticales)
 * despliega un menú con acciones. Las acciones se reciben como array de objetos
 * con `label`, `onClick` y opcionalmente un `icon`.
 *
 * @param {Object}   props
 * @param {Array}    props.actions - Lista de acciones del menú [{ label, onClick, icon }]
 *
 * @returns {JSX.Element} Componente interactivo de menú dropdown
 */

const DropdownMenu = ({ actions = [], colorDots = 'black' }) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isDeleteAction = (action) => {
    return action.isDelete ||
      action.label?.toLowerCase().includes('delete') ||
      action.label?.toLowerCase().includes('eliminar')
  }

  return (
    <div
      className="custom-dropdown"
      style={{ '--color-dots': colorDots }}
      ref={menuRef}
      onClick={() => setOpen(!open)}

    >
      <button className="custom-dropdown__dots">
        <span></span>
        <span></span>
        <span></span>
      </button>
      {Array.isArray(actions) && open && (
        <ul>
          {actions.map((action, idx) => {
            const isDelete = isDeleteAction(action)
            return (
              <li
                key={idx}
                className={isDelete ? 'custom-dropdown__action--delete' : ''}
                onClick={() => {
                  setOpen(false)
                  action.onClick()
                }}
              >
                {action.icon && action.icon}
                <span>{action.label}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default DropdownMenu
