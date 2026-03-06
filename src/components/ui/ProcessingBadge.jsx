/**
 * ProcessingBadge - Badge reutilizable para mostrar estado de procesamiento
 * 
 * @param {Object} props
 * @param {string} props.text - Texto a mostrar en el badge
 * @param {string} props.className - Clase CSS adicional opcional
 * @param {string} props.position - Posición del badge ('top-right', 'top-left', 'bottom-right', 'bottom-left')
 */

import GradientBar from './GradientBar'

function ProcessingBadge({
  className = '',
  position = 'top-right'
}) {
  return (
    <div className={`processing-badge processing-badge--${position} ${className}`}>
      <GradientBar className="processing-badge__gradient" />
    </div>
  )
}

export default ProcessingBadge
