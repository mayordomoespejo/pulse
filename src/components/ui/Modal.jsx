import { useCallback, useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'

import { CloseIcon } from '../../assets/icons/icons'
import useBreakpoint from '../../hooks/useBreakpoint'

/**
 * Modal - Componente de ventana modal genérico con animación de apertura y cierre
 *
 * Muestra una ventana emergente centrada con un fondo semitransparente.
 * Permite incluir título, contenido, botón de cierre y botones de acción personalizados.
 * En dispositivos móviles, se abre desde abajo y permite cerrarse arrastrando hacia abajo.
 *
 * @param {string}   title               Título del modal (opcional)
 * @param {JSX.Element} children        Contenido principal del modal
 * @param {Function} onClose            Función que se ejecuta al cerrar el modal
 * @param {JSX.Element} [actions]       Botones u acciones a mostrar en el pie del modal (opcional)
 * @param {string}   [actionsAlignment] Alineación de los botones ('left', 'center', 'right', 'space-between')
 * @param {boolean}  [isFloating]        Si el modal es flotante (opcional)
 * @param {string}   [className]         Clase adicional para el contenedor del modal (opcional)
 * @param {string}   [classNameContent]  Clase adicional para el contenido del modal (opcional)
 * @param {JSX.Element} [iconClose]      Icono de cierre (opcional)
 * @param {boolean}  [dragEnabled]       Si el modal permite arrastrar (opcional)
 * @param {Object}   [onCloseRef]        Ref opcional para disparar el cierre animado desde fuera
 *
 * @returns {JSX.Element|null} Modal renderizado
 */

const Modal = ({
  title,
  subtitle,
  children,
  onClose,
  actions,
  actionsAlignment = 'space-between',
  isFloating = false,
  className = '',
  classNameContent = '',
  classNameBackdrop = '',
  iconClose = <CloseIcon />,
  dragEnabled = true,
  onCloseRef = null
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragOffsetY, setDragOffsetY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const modalRef = useRef(null)
  const { isPhone, isTablet } = useBreakpoint()

  useEffect(() => {
    document.body.classList.add('modal-open')
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => {
      clearTimeout(timer)
      document.body.classList.remove('modal-open')
    }
  }, [])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [onClose])

  const handleTouchStart = (e) => {
    if (!isPhone || !dragEnabled) return
    setDragStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e) => {
    if (!isPhone || !isDragging || !dragEnabled) return
    const currentY = e.touches[0].clientY
    const offset = currentY - dragStartY

    if (offset > 0) {
      setDragOffsetY(offset)
    }
  }

  const handleTouchEnd = () => {
    if (!isPhone || !isDragging || !dragEnabled) return

    setIsDragging(false)

    if (dragOffsetY > 100) {
      handleClose()
      return
    }

    setDragOffsetY(0)
  }

  const getModalStyles = () => {
    if (!isPhone || !isDragging || !dragEnabled) return {}

    return {
      transform: `translateY(${dragOffsetY}px)`,
      transition: 'none'
    }
  }

  useEffect(() => {
    if (!onCloseRef) return
    onCloseRef.current = handleClose
    return () => {
      onCloseRef.current = null
    }
  }, [handleClose, onCloseRef])

  return (
    <div
      className={`modal__backdrop ${isVisible ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''} ${classNameBackdrop}`}
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        className={`modal ${isVisible ? 'is-open' : ''} ${isClosing ? 'is-closing' : ''} ${className}`}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={getModalStyles()}
      >
        {isPhone && dragEnabled && (
          <div className="modal__drag-indicator">
            <div className="modal__drag-handle"></div>
          </div>
        )}

        <div className="modal__header">
          {title && <h2 className="modal__header__title">{title}</h2>}

          <button className="modal__header__close" onClick={handleClose}>
            {iconClose}
          </button>
          {subtitle && <h2 className="modal__header__subtitle">{subtitle}</h2>}
        </div>
        <div className={`modal__content ${classNameContent}`}>{children}</div>
        {(!actions || isClosing) ? <></> : (isTablet || !isFloating)
          ? (
            <div className={`modal__actions modal__actions--${actionsAlignment}`}>
              {actions}
            </div>
          ) : (createPortal(
            <div className={'modal__actions modal__actions--floating'}>
              {actions}
            </div>,
            document.body))}
      </div>
    </div>
  )
}

export default Modal
