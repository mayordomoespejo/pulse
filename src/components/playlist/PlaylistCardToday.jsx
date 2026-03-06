import { useNavigate } from 'react-router-dom'

import { PlayIcon, PlaylistIcon, StarIcon } from '../../assets/icons/icons'
import { DEFAULT_VIDEO_THUMBNAIL } from '../../constants/constants'
import useVideoStore from '../../stores/videoStore'
import TitleCard from '../ui/TitleCard'


function PlaylistCardToday({ playlist }) {
  const { name, tags, playlistItems } = playlist || {}

  const videosCount = Array.isArray(playlistItems)
    ? playlistItems.length
    : undefined

  const derivedFromItems = (playlistItems ?? []).map((item) => item?.video?.thumbnailUrl).find(Boolean)

  const thumbnail = derivedFromItems || DEFAULT_VIDEO_THUMBNAIL
  const isDisabled = videosCount === 0

  const totalDuration = playlistItems?.reduce((total, item) => total + (item.video?.duration || 0), 0) || 0
  const minutes = Math.floor(totalDuration / 60)
  const seconds = totalDuration % 60
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`

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
    <li className={`playlist-card-today ${isDisabled && 'playlist-card-today--disabled'}`} onClick={handleDetailPlaylist}>
      <div className="playlist-card-today__badge">
        <StarIcon width={16} height={16} stroke="var(--color-secondary)" /> Playlist del día
      </div>
      <div className="playlist-card-today__thumbnail-wrapper">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={`${thumbnail}-${index}`} className={`playlist-card-today__stack-img-wrapper  playlist-card-today__stack-img--${index + 1}`}>
          </div>
        ))}
        <img src={thumbnail} alt={name}
          className={`playlist-card-today__thumbnail ${videosCount === 0 && 'playlist-card-today__thumbnail--disabled'}`} />
        {videosCount > 0 && (
          <span className="playlist-card-today__play" >
            <PlayIcon width={14} height={16} />
          </span>
        )}
        {typeof videosCount === 'number' && (
          <div className="playlist-card-today__meta">
            <PlaylistIcon className="playlist-card-today__meta__icon" />
            <span className="playlist-card-today__meta__videos">{videosCount} videos - {formattedDuration}</span>
          </div>
        )}
      </div>
      <TitleCard
        title={name}
        tags={tags}
        onClick={handleDetailPlaylist}
        disabled={isDisabled} />
    </li >
  )
}

export default PlaylistCardToday
