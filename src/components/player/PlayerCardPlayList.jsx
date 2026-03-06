import { useTranslation } from 'react-i18next'

import ProcessingBadge from '../ui/ProcessingBadge'
import Tags from '../ui/Tags'
import VideoDuration from '../video/VideoDuration'

/**
 * Single item row in the player sidebar playlist.
 * Disabled and shows a processing badge when the video URL is not available.
 *
 * @param {Object} props
 * @param {Object} props.playlistItem - Playlist item from the store.
 * @param {Function} props.setCurrentVideo - Store action to set the active video.
 * @param {boolean} props.isActive - Highlights this item as currently playing.
 * @returns {JSX.Element}
 */
function PlayerCardPlayList({ playlistItem, setCurrentVideo, isActive }) {
  const { t } = useTranslation()
  const VIDEO_CARD = t('VIDEO_CARD', { returnObjects: true })

  const { thumbnailUrl, title, duration, tags, url } = playlistItem?.video || {}

  const handleClick = () => {
    if (url) {
      setCurrentVideo(playlistItem)
    }
  }

  return (
    <li
      className={`player-card-play-list ${!url ? 'player-card-play-list--disabled' : ''}`}
      onClick={handleClick}
    >
      <div className={`player-card-play-list__image-container ${!url ? 'player-card-play-list__image-container--disabled' : ''}`}>
        {thumbnailUrl && <img src={thumbnailUrl} alt={title} />}
        <VideoDuration duration={duration} />
        {!url && (
          <ProcessingBadge
            position="top-right"
          />
        )}
      </div>
      <div className="player-card-play-list__title-container">
        <div className={`player-card-play-list__title ${!url ? 'player-card-play-list__title--disabled' : ''} ${isActive ? 'player-card-play-list--active' : ''}`}>
          <span className="player-card-play-list__title-text">{title}</span>
          {!url && (
            <span className="player-card-play-list__processing">{VIDEO_CARD.PROCESSING}</span>
          )}
        </div>
        <Tags tags={tags} />
      </div>
    </li>
  )
}

export default PlayerCardPlayList
