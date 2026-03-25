import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * PlayerQualityMenu — quality selector dropdown rendered inside the player control bar.
 *
 * @param {Array}    playbackSources   - array of { id, quality, height, width } source objects
 * @param {string}   selectedSourceId  - currently active source id (or 'auto')
 * @param {Function} formatSourceLabel - (source) => string  label formatter
 * @param {Function} onChange          - ({ sourceId, currentTime, shouldPlay }) => void
 */
const PlayerQualityMenu = ({ playbackSources, selectedSourceId, formatSourceLabel, onChange }) => {
  const { t } = useTranslation()
  const PLAYER_VIDEO = t('PLAYER_VIDEO', { returnObjects: true })

  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  const selectedQualityLabel =
    selectedSourceId === 'auto'
      ? PLAYER_VIDEO.QUALITY_AUTO
      : (formatSourceLabel(playbackSources.find((s) => s.id === selectedSourceId)) ?? PLAYER_VIDEO.QUALITY_AUTO)

  const longestLabel = [PLAYER_VIDEO.QUALITY_AUTO, ...playbackSources.map(formatSourceLabel)].reduce(
    (longest, label) => (label.length > longest.length ? label : longest),
    ''
  )

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event) => {
      if (!menuRef.current || menuRef.current.contains(event.target)) return
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSelect = (sourceId) => {
    // Capture playback state from the DOM before the source swap
    const mediaElement = document.querySelector('video, audio, castable-video')
    const currentTime = Number(mediaElement?.currentTime) || 0
    const shouldPlay = Boolean(mediaElement && !mediaElement.paused && !mediaElement.ended)

    onChange({ sourceId, currentTime, shouldPlay })
    setIsOpen(false)
  }

  return (
    <div className="player-video__quality-dropdown" ref={menuRef}>
      <button
        type="button"
        className="player-video__quality-trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={PLAYER_VIDEO.QUALITY}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <span className="player-video__quality-trigger-sizer" aria-hidden>
          {longestLabel}
        </span>
        <span className="player-video__quality-trigger-label">{selectedQualityLabel}</span>
      </button>

      {isOpen && (
        <ul className="player-video__quality-menu" role="menu">
          <li>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={selectedSourceId === 'auto'}
              className={`player-video__quality-option ${selectedSourceId === 'auto' ? 'player-video__quality-option--active' : ''}`}
              onClick={() => handleSelect('auto')}
            >
              {PLAYER_VIDEO.QUALITY_AUTO}
            </button>
          </li>
          {playbackSources.map((source) => (
            <li key={source.id}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={selectedSourceId === source.id}
                className={`player-video__quality-option ${selectedSourceId === source.id ? 'player-video__quality-option--active' : ''}`}
                onClick={() => handleSelect(source.id)}
              >
                {formatSourceLabel(source)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PlayerQualityMenu
