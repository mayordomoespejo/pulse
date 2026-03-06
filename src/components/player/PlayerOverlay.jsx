import { useMediaSelector } from 'media-chrome/react/media-store'
import { useMediaDispatch, MediaActionTypes } from 'media-chrome/react/media-store'
import { useTranslation } from 'react-i18next'

import { LogoIcon } from '../../assets/icons/icons'
import useBreakpoint from '../../hooks/useBreakpoint'
import useVideoStore from '../../stores/videoStore'
import Heading from '../ui/Heading'
import Spinner from '../ui/Spinner'

import PlayerIconWrapper from './PlayerIconWrapper'
import PlayerNextPrev from './PlayerNextPrev'
import PlayerPlayPause from './PlayerPlayPause'
import PlayerReload from './PlayerReload'


function PlayerOverlay() {
  const { t } = useTranslation()
  const PLAYER_OVERLAY = t('PLAYER_OVERLAY', { returnObjects: true })
  const { isTablet } = useBreakpoint()
  const {
    currentVideo,
    prevVideo,
    nextVideo,
    currentPlaylist,
    onNextVideo,
    onPrevVideo,
    onResetPlaylist,
  } = useVideoStore()

  const dispatch = useMediaDispatch()
  const mediaState = useMediaSelector(state => state)

  const { mediaEnded, mediaLoading } = mediaState

  const hasPlaylistItems = Array.isArray(currentPlaylist?.playlistItems) && currentPlaylist?.playlistItems.length > 0
  const hasCurrentVideo = Boolean(currentVideo?.video?.url)

  const handleOnNextVideo = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onNextVideo(nextVideo)
  }

  const handleOnPrevVideo = (event) => {
    event.preventDefault()
    event.stopPropagation()
    onPrevVideo(prevVideo)
  }
  const handleOnResetPlaylist = (event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    onResetPlaylist(currentPlaylist)
    requestAnimationFrame(() => {
      dispatch({ type: MediaActionTypes.MEDIA_SEEK_REQUEST, detail: 0 })
      dispatch({ type: MediaActionTypes.MEDIA_PLAY_REQUEST })
    })
  }

  const onReload = (event) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch({ type: MediaActionTypes.MEDIA_SEEK_REQUEST, detail: 0 })
    dispatch({ type: MediaActionTypes.MEDIA_PLAY_REQUEST })
  }

  const handleOnClickOverlay = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (mediaEnded && nextVideo) {
      onNextVideo(nextVideo)
    }
  }

  const renderStateContent = () => {
    // Empty state --> No playlist items or no current video
    if (!hasPlaylistItems || !hasCurrentVideo) {
      return (
        <div className="player-overlay__empty">
          <span className="player-overlay__empty-title">{PLAYER_OVERLAY.EMPTY}</span>
        </div>
      )
    }
    // Spinner --> Se muestra cuando el video está cargando
    if (mediaLoading) return <PlayerIconWrapper Component={Spinner} isCircle />

    // Play pause icon --> Se muestra cuando el video no ha finalizado y no hay un siguiente video
    if (!mediaEnded && !mediaLoading) return <PlayerPlayPause isCircle sizeCircle="large" />

    // Canceled overlay --> Se muestra al finalizar el video, next video, reload
    if (mediaEnded && nextVideo) {
      return (
        <div className="player-overlay__ended-finalized">
          <PlayerNextPrev isCircle isPrev onPrevVideo={handleOnPrevVideo} isDisabled={!prevVideo} />
          <PlayerReload isCircle sizeCircle="small" onClick={onReload} />
          <PlayerNextPrev isCircle onNextVideo={handleOnNextVideo} isDisabled={!nextVideo} />
        </div>
      )
    }

    // Finalized overlay --> Se muestra al finalizar el video y no hay un siguiente video
    if (mediaEnded && !nextVideo) {
      return (
        <div className="player-overlay__finished">
          <PlayerReload isCircle onClick={handleOnResetPlaylist} sizeCircle="large" />
        </div>
      )
    }

    return null
  }

  return (
    <>
      <div className="player-overlay__heading" slot="top-chrome" >
        <LogoIcon width={isTablet ? 40 : 30} height={isTablet ? 40 : 30} fill="var(--color-secondary)" />
        <Heading
          title={hasCurrentVideo ? currentVideo?.video?.title : ''}
          responsiveStyles={{ fontSize: { phone: 14, desktop: 24 } }}
          color="#fff"
          className="player-overlay__heading__title"
        />
      </div>
      <div
        className="player-overlay"
        slot="centered-chrome"
        onClick={handleOnClickOverlay}>
        {renderStateContent()}
      </div>
    </>
  )
}

export default PlayerOverlay
