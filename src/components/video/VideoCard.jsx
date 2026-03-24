import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { PEXELS_URL } from '../../constants/constants'
import { useFavorites } from '../../hooks/useFavorites'
import { ROUTES_NAMES } from '../../router/routesNames'
import { HeartIcon } from '../../assets/icons/icons'
import TitleCard from '../ui/TitleCard'

import VideoDuration from './VideoDuration'

function VideoCard({ video }) {
  const { t } = useTranslation()
  const PEXELS = t('PEXELS', { returnObjects: true })
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()

  const {
    id,
    title,
    thumbnailUrl,
    duration,
    pexelsUrl,
    photographer,
    photographerUrl,
  } = video || {}

  const favorited = isFavorite(id)

  const handleOpenDetail = () => {
    if (!id) return
    navigate(ROUTES_NAMES.VIDEO_DETAIL.replace(':videoId', id))
  }

  const handleToggleFavorite = (event) => {
    event.stopPropagation()
    toggleFavorite(video)
  }

  return (
    <article
      className="video-card video-card--clickable"
      onClick={handleOpenDetail}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleOpenDetail()
        }
      }}
    >
      <div className="video-card__thumbnail">
        <img src={thumbnailUrl} alt={title} loading="lazy" />
        <VideoDuration duration={duration} />
        <button
          className={`video-card__favorite${favorited ? ' video-card__favorite--active' : ''}`}
          onClick={handleToggleFavorite}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon fill={favorited ? 'currentColor' : 'none'} stroke="currentColor" width="16" height="16" />
        </button>
      </div>

      <div className="video-card__content">
        <TitleCard title={title} tags={[]} className="video-card__title-card" onClick={handleOpenDetail} />

        <p className="video-card__credits">
          {PEXELS.VIDEO_BY}{' '}
          <a href={photographerUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
            {photographer}
          </a>{' '}{PEXELS.ON}{' '}
          <a href={pexelsUrl || PEXELS_URL} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
            {PEXELS.BRAND}
          </a>
        </p>
      </div>
    </article>
  )
}

export default VideoCard
