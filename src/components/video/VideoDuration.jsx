import PropTypes from 'prop-types'

/**
 * Convierte la duración en segundos al formato de visualización
 * @param {number} seconds - Duración en segundos
 * @returns {string} Duración formateada (MM:SS o HH:MM:SS)
 */
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    // Formato: HH:MM:SS (para videos de una hora o más)
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Formato: MM:SS (para videos menores a una hora)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * VideoDuration - Componente para mostrar la duración de un video
 *
 * Muestra la duración del video en formato legible (MM:SS o HH:MM:SS)
 * con estilos consistentes para la interfaz de usuario.
 *
 * Props:
 * @param {number} duration - Duración del video en segundos
 * @param {string} [className=''] - Clases CSS adicionales
 *
 * @returns {JSX.Element|null} Span con la duración formateada o null si no hay duración
 */

function VideoDuration({ duration, className = '' }) {
  if (!duration) return null

  const formattedDuration = formatDuration(duration)

  return (
    <span className={`video-duration ${className}`}>
      {formattedDuration}
    </span>
  )
}

VideoDuration.propTypes = {
  duration: PropTypes.number.isRequired,
  className: PropTypes.string,
}

export default VideoDuration
