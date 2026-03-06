/**
 * Formats a duration in seconds to MM:SS or HH:MM:SS.
 *
 * @param {number} seconds - Duration in seconds.
 * @returns {string} Formatted duration string.
 */
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Displays a video duration badge.
 *
 * @param {Object} props
 * @param {number} props.duration - Duration in seconds.
 * @param {string} [props.className=''] - Additional CSS classes.
 * @returns {JSX.Element|null}
 */
function VideoDuration({ duration, className = '' }) {
  if (!duration) return null

  return (
    <span className={`video-duration ${className}`}>
      {formatDuration(duration)}
    </span>
  )
}

export default VideoDuration
