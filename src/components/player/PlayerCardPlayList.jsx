import { useTranslation } from 'react-i18next'

import { DEFAULT_VIDEO_THUMBNAIL } from '../../constants/constants'
import ProcessingBadge from '../ui/ProcessingBadge'
import Tags from '../ui/Tags'
import VideoDuration from '../video/VideoDuration'

function PlayerCardPlayList({ playlistItem, setCurrentVideo, isActive }) {
  const { t } = useTranslation()
  const VIDEO_CARD = t('VIDEO_CARD', { returnObjects: true })

  const { thumbnailUrl, title, duration, tags, url } = playlistItem?.video || {}
  const defaultThumbnail = thumbnailUrl || DEFAULT_VIDEO_THUMBNAIL

  // Función para manejar el clic - solo permite interacción si hay URL
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
        {defaultThumbnail && <img src={defaultThumbnail} alt={title} />}
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
