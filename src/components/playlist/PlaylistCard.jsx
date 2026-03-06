import { useNavigate } from 'react-router-dom'

import { GridIcon, PlayIcon, PlaylistIcon } from '../../assets/icons/icons'
import { DEFAULT_VIDEO_THUMBNAIL } from '../../constants/constants'
import useVideoStore from '../../stores/videoStore'
import PlaylistActionsBar from '../common/PlaylistActionsBar'
import TitleCard from '../ui/TitleCard'

/**
 * PlaylistCard - Tarjeta base para mostrar una playlist
 *
 * Muestra: portada, botón de play centrado, contador de vídeos,
 * título, menú de acciones y lista de tags.
 *
 * @param {Object}   props
 * @param {Object}   props.playlist                         Datos de la playlist
 * @param {string}   [props.playlist.title]                 Título de la playlist
 * @param {string}   [props.playlist.name]                  Alternativa de título (si el backend usa name)
 * @param {string}   [props.playlist.thumbnailUrl]          URL de la miniatura/portada
 * @param {Array}    [props.playlist.tags]                  Tags [{ id, name } | string]
 * @param {number}   [props.playlist.videosCount]           Número de vídeo
 */

const PlaylistCard = ({
  dataLabel,
  playlist,
}) => {
  const title = playlist?.name || ''

  const videosCount = Array.isArray(playlist?.playlistItems)
    ? playlist.playlistItems.length
    : undefined

  const derivedFromItems = (playlist?.playlistItems ?? []).map((item) => item?.video?.thumbnailUrl).find(Boolean)

  const thumbnail = derivedFromItems || DEFAULT_VIDEO_THUMBNAIL
  const isDisabled = videosCount === 0

  const navigate = useNavigate()
  const { setAutoFullscreen } = useVideoStore()

  const handleDetailPlaylist = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (isDisabled || !playlist?.id) return

    setAutoFullscreen(true)
    navigate(`/playlist/${playlist?.id}`)
  }


  return (
    <div
      className={'playlist-card '}
      data-label={dataLabel}

    >
      <div className="playlist-card__thumbnail-wrapper">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`${thumbnail}-${index}`}
            className={`playlist-card__stack-img-wrapper 
              playlist-card__stack-img--${index + 1}`}>
          </div>
        ))}
        <img
          src={thumbnail}
          alt={title}
          onClick={handleDetailPlaylist}
          className={`playlist-card__thumbnail ${isDisabled && 'playlist-card__thumbnail--disabled'}`} />
        {videosCount > 0 && (
          <span className="playlist-card__play" onClick={handleDetailPlaylist} >
            <PlayIcon width={14} height={16} />
          </span>
        )}
        {/* OJO !!!: la clase **playlist-card__grid-icon** esta enlazada con el drag and drop,
         en PlaylistSortVideosModal.jsx, es para la funcionalidad de drag and drop al pinchar en el icono de la grid */}
        <GridIcon className="playlist-card__grid-icon" />
        {typeof videosCount === 'number' && (
          <div className="playlist-card__meta">
            <PlaylistIcon className="playlist-card__meta__icon" />
            <span className="playlist-card__meta__videos">{videosCount} videos</span>
          </div>
        )}
      </div>
      <PlaylistActionsBar playlist={playlist} />
      <TitleCard
        title={title}
        tags={playlist?.tags}
        onClick={handleDetailPlaylist}
        disabled={isDisabled} />
    </div >
  )
}

export default PlaylistCard


