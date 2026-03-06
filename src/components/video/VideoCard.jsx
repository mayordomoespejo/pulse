import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { DEFAULT_VIDEO_THUMBNAIL } from '../../constants/constants'
import { ROUTES_NAMES } from '../../router/routesNames'
import TitleCard from '../ui/TitleCard'

import VideoDuration from './VideoDuration'

/**
 * Video preview card with attribution and detail navigation.
 *
 * @param {Object} props Component props.
 * @param {Object} props.video Normalized video model.
 * @returns {JSX.Element}
 */
function VideoCard({ video }) {
  const { t } = useTranslation()
  const PEXELS = t('PEXELS', { returnObjects: true })

  const navigate = useNavigate()

  const {
    id,
    title,
    thumbnailUrl,
    duration,
    pexelsUrl,
    photographer,
    photographerUrl,
  } = video || {}

  const handleOpenDetail = () => {
    if (!id) return
    navigate(ROUTES_NAMES.VIDEO_DETAIL.replace(':videoId', id))
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
        <img src={thumbnailUrl || DEFAULT_VIDEO_THUMBNAIL} alt={title} loading="lazy" />
        <VideoDuration duration={duration} />
      </div>

      <div className="video-card__content">
        <TitleCard title={title} tags={[]} className="video-card__title-card" onClick={handleOpenDetail} />

        <p className="video-card__credits">
          {PEXELS.VIDEO_BY}{' '}
          <a href={photographerUrl} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
            {photographer}
          </a>{' '}{PEXELS.ON}{' '}
          <a href={pexelsUrl || 'https://www.pexels.com'} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>
            {PEXELS.BRAND}
          </a>
        </p>
      </div>
    </article>
  )
}

export default VideoCard
