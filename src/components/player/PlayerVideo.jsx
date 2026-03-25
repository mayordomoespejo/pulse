import { MediaController, MediaControlBar, MediaTimeRange, MediaTimeDisplay, MediaVolumeRange } from 'media-chrome/react'
import { useMediaRef, useMediaDispatch, MediaActionTypes } from 'media-chrome/react/media-store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'

import useFullscreen from '../../hooks/useFullscreen'
import useVolumeControl from '../../hooks/useVolumeControl'
import useVideoStore from '../../stores/videoStore'

import PlayerControlsToggle from './PlayerControlsToggle'
import PlayerFullscreen from './PlayerFullscreen'
import PlayerNextPrev from './PlayerNextPrev'
import PlayerOverlay from './PlayerOverlay'
import PlayerPlayPause from './PlayerPlayPause'
import PlayerQualityMenu from './PlayerQualityMenu'
import PlayerVolumeButton from './PlayerVolumeButton'

import 'castable-video'

const PlayerVideo = () => {
  const { t } = useTranslation()
  const PLAYER_VIDEO = t('PLAYER_VIDEO', { returnObjects: true })
  const [showControlsInFullscreen, setShowControlsInFullscreen] = useState(true)
  const [selectedSourceId, setSelectedSourceId] = useState('auto')
  const pendingSeekRef = useRef(null)

  const mediaRef = useMediaRef()
  const dispatch = useMediaDispatch()
  const didRequestFullscreenRef = useRef(false)
  const mediaIsFullscreen = useFullscreen()

  const {
    currentVideo,
    nextVideo,
    onNextVideo,
    autoFullscreen,
    setAutoFullscreen,
    volume,
    setVolume,
  } = useVideoStore()

  const hasCurrentVideo = Boolean(currentVideo?.video?.url)
  const playbackSources = useMemo(() => currentVideo?.video?.playbackSources || [], [currentVideo?.video?.playbackSources])
  const hasQualityOptions = playbackSources.length > 1

  const selectedSourceLink = useMemo(() => {
    if (selectedSourceId === 'auto') return currentVideo?.video?.url
    return playbackSources.find((source) => source.id === selectedSourceId)?.link || currentVideo?.video?.url
  }, [currentVideo?.video?.url, playbackSources, selectedSourceId])

  const { canControlVolume, readCurrentVolume } = useVolumeControl(mediaRef, volume, hasCurrentVideo)

  const formatSourceLabel = useCallback((source) => {
    const rawQuality = String(source?.quality || '').trim().toUpperCase()
    const isUnknownQuality = !rawQuality || rawQuality === 'UNKNOWN' || rawQuality === 'NULL'
    const qualityLabel = isUnknownQuality
      ? ''
      : (PLAYER_VIDEO[`QUALITY_${rawQuality}`] || rawQuality)
    const resolution = source?.height ? `${source.height}p` : source?.width ? `${source.width}w` : ''

    if (qualityLabel && resolution) return `${qualityLabel} (${resolution})`
    if (resolution) return resolution
    if (qualityLabel) return qualityLabel
    return PLAYER_VIDEO.QUALITY
  }, [PLAYER_VIDEO])

  const getMediaElement = useCallback(() => {
    const node = mediaRef?.current
    if (node && typeof node.getInternalPlayer === 'function') {
      return node.getInternalPlayer()
    }
    if (node && typeof node.currentTime === 'number') return node
    return document.querySelector('video, audio, castable-video')
  }, [mediaRef])

  // Auto-fullscreen on first load
  useEffect(() => {
    if (!autoFullscreen || didRequestFullscreenRef.current) return
    const t = setTimeout(() => {
      const button = document.querySelector('.player-fullscreen')
      if (button) button.click()
      didRequestFullscreenRef.current = true
      setAutoFullscreen(false)
    }, 0)
    return () => clearTimeout(t)
  }, [autoFullscreen, dispatch, setAutoFullscreen, setShowControlsInFullscreen])

  // Reset source selection when video changes
  useEffect(() => {
    setSelectedSourceId('auto')
    pendingSeekRef.current = null
  }, [currentVideo?.video?.id])

  // Restore playback position after a quality switch
  useEffect(() => {
    const pendingSeek = pendingSeekRef.current
    if (!pendingSeek) return

    const timerId = setTimeout(() => {
      const mediaElement = getMediaElement()
      if (!mediaElement) return

      try {
        mediaElement.currentTime = pendingSeek.time
      } catch {
        // noop
      }

      dispatch({
        type: pendingSeek.shouldPlay
          ? MediaActionTypes.MEDIA_PLAY_REQUEST
          : MediaActionTypes.MEDIA_PAUSE_REQUEST,
      })
      pendingSeekRef.current = null
    }, 0)

    return () => clearTimeout(timerId)
  }, [dispatch, getMediaElement, selectedSourceLink])

  const handleNext = useCallback(() => {
    const v = readCurrentVolume()
    if (typeof v === 'number' && !Number.isNaN(v)) setVolume(v)
    onNextVideo(nextVideo)
  }, [nextVideo, onNextVideo, readCurrentVolume, setVolume])

  const handleQualityChange = useCallback(({ sourceId, currentTime, shouldPlay }) => {
    pendingSeekRef.current = { time: currentTime, shouldPlay }
    setSelectedSourceId(sourceId)
  }, [])

  const renderControls = () => (
    <>
      <div className="media-control-bar__left">
        <PlayerPlayPause />
        <MediaTimeDisplay showDuration />
      </div>
      <MediaTimeRange className="media-control-bar__time-range" />
      <div className="media-control-bar__right">
        <PlayerNextPrev
          onNextVideo={handleNext}
          isShow={nextVideo}
        />
        <PlayerVolumeButton disabled={!canControlVolume} />
        <MediaVolumeRange
          className={!canControlVolume ? 'media-control-bar__volume-range--disabled' : ''}
          disabled={!canControlVolume}
          aria-disabled={!canControlVolume}
        />
        {hasQualityOptions && (
          <PlayerQualityMenu
            playbackSources={playbackSources}
            selectedSourceId={selectedSourceId}
            formatSourceLabel={formatSourceLabel}
            onChange={handleQualityChange}
          />
        )}
        <PlayerFullscreen />
      </div>
    </>
  )

  return (
    <div className="player-video">
      <MediaController className="player-video__media-container">
        {hasCurrentVideo && (
          <ReactPlayer
            slot="media"
            src={selectedSourceLink || currentVideo?.video?.url}
            controls={false}
            playsInline
            muted
            crossOrigin="anonymous"
            preload="metadata"
            autoPlay
            ref={mediaRef}
            className="player-video__video"
            width="100%"
            height="100%"
            volume={volume}
          />
        )}

        <PlayerOverlay />
        {hasCurrentVideo && (
          <MediaControlBar className="media-control-bar">
            {mediaIsFullscreen && showControlsInFullscreen && renderControls()}
            {!mediaIsFullscreen && renderControls()}
            <PlayerControlsToggle
              showControlsInFullscreen={showControlsInFullscreen}
              setShowControlsInFullscreen={setShowControlsInFullscreen}
            />
          </MediaControlBar>
        )}
      </MediaController>
    </div>
  )
}

export default PlayerVideo
