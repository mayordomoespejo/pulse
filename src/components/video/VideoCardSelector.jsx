import { useTranslation } from 'react-i18next'

import { GridIcon } from '../../assets/icons/icons'
import { DEFAULT_VIDEO_THUMBNAIL } from '../../constants/constants'
import Checkbox from '../ui/Checkbox'
import ProcessingBadge from '../ui/ProcessingBadge'
import Tags from '../ui/Tags'

import VideoDuration from './VideoDuration'


function VideoCardSelector({
  video,
  toggleId = null,
  isSelected,
  isDragging = false,
}) {
  const { t } = useTranslation()
  const VIDEO_CARD = t('VIDEO_CARD', { returnObjects: true })

  const thumbnail = video?.thumbnailUrl || DEFAULT_VIDEO_THUMBNAIL
  const { url } = video || {}

  // Función para manejar el clic - solo permite selección si hay URL
  const handleClick = ({ target }) => {
    if (target.closest('.video-card-selector__checkbox')) return
    if (!toggleId || !url) return
    toggleId(video?.id)
  }
  return (
    <div key={video?.id} className={`video-card-selector ${!url ? 'video-card-selector--disabled' : ''}`}>
      <div
        className={`video-card-selector__thumbnail ${isSelected ? 'is-selected' : ''} ${!url ? 'video-card-selector__thumbnail--disabled' : ''}`}
        onClick={handleClick}
      >
        <img src={thumbnail} alt={video?.title} />
        {!isDragging && url && (
          <Checkbox
            useFormik={false}
            className="video-card-selector__checkbox"
            checked={isSelected}
            onChange={() => toggleId && toggleId(video?.id)}
          />
        )}
        <VideoDuration duration={video?.duration} />
        {!url && (
          <ProcessingBadge
            text={VIDEO_CARD.PROCESSING}
            position="top-right"
          />
        )}
      </div>
      {/* OJO !!!: la clase **video-card-selector__grid-icon** esta enlazada con el drag and drop,
       en PlaylistSortVideosModal.jsx, es para la funcionalidad de drag and drop al pinchar en el icono de la grid */}
      {isDragging && <GridIcon className="video-card-selector__grid-icon" />}
      <div className="video-card-selector__title-container">
        <span className="video-card-selector__title-container__title">{video?.title}</span>
      </div>
      <Tags tags={video?.tags} />
    </div>
  )
}


export default VideoCardSelector