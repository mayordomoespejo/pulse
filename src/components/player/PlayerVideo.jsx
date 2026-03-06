import { MediaController, MediaControlBar, MediaTimeRange, MediaTimeDisplay, MediaVolumeRange } from 'media-chrome/react'
import { useMediaRef, useMediaDispatch, MediaActionTypes } from 'media-chrome/react/media-store'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'

import useFullscreen from '../../hooks/useFullscreen'
import useVideoStore from '../../stores/videoStore'

import PlayerControlsToggle from './PlayerControlsToggle'
import PlayerFullscreen from './PlayerFullscreen'
import PlayerNextPrev from './PlayerNextPrev'
import PlayerOverlay from './PlayerOverlay'
import PlayerPlayPause from './PlayerPlayPause'
import PlayerVolumeButton from './PlayerVolumeButton'

import 'castable-video'

const PlayerVideo = () => {
  const { t } = useTranslation()
  const PLAYER_VIDEO = t('PLAYER_VIDEO', { returnObjects: true })
  const [showControlsInFullscreen, setShowControlsInFullscreen] = useState(true)
  const [canControlVolume, setCanControlVolume] = useState(true)
  const [selectedSourceId, setSelectedSourceId] = useState('auto')
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false)
  const pendingSeekRef = useRef(null)
  const qualityMenuRef = useRef(null)

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

  const getMediaElement = useCallback(() => {
    const node = mediaRef?.current
    if (node && typeof node.getInternalPlayer === 'function') {
      return node.getInternalPlayer()
    }
    if (node && typeof node.currentTime === 'number') return node
    return document.querySelector('video, audio, castable-video')
  }, [mediaRef])

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
  const selectedQualityLabel = useMemo(() => {
    if (selectedSourceId === 'auto') return PLAYER_VIDEO.QUALITY_AUTO
    const selectedSource = playbackSources.find((source) => source.id === selectedSourceId)
    return selectedSource ? formatSourceLabel(selectedSource) : PLAYER_VIDEO.QUALITY_AUTO
  }, [PLAYER_VIDEO.QUALITY_AUTO, formatSourceLabel, playbackSources, selectedSourceId])

  const canWriteVolume = useCallback((target) => {
    if (!target || typeof target !== 'object' || !('volume' in target)) return false

    const originalVolume = Number(target.volume)
    if (!Number.isFinite(originalVolume)) return false

    const nextVolume = originalVolume > 0.5 ? 0.45 : 0.55

    try {
      target.volume = nextVolume
      const changed = Math.abs(Number(target.volume) - nextVolume) < 0.001
      target.volume = originalVolume
      return changed
    } catch {
      return false
    }
  }, [])

  const detectVolumeControlSupport = useCallback(() => {
    const node = mediaRef?.current
    if (!node) return false

    if (typeof node.setVolume === 'function') return true

    if (typeof node.getInternalPlayer === 'function') {
      const internal = node.getInternalPlayer()
      if (internal && typeof internal.setVolume === 'function') return true
      if (canWriteVolume(internal)) return true
    }

    if (canWriteVolume(node)) return true

    const mediaElement = document.querySelector('video, audio, castable-video')
    return canWriteVolume(mediaElement)
  }, [canWriteVolume, mediaRef])

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

  useEffect(() => {
    setSelectedSourceId('auto')
    pendingSeekRef.current = null
  }, [currentVideo?.video?.id])

  useEffect(() => {
    if (!isQualityMenuOpen) return

    const handleClickOutside = (event) => {
      if (!qualityMenuRef.current || qualityMenuRef.current.contains(event.target)) return
      setIsQualityMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isQualityMenuOpen])

  useEffect(() => {
    if (!hasCurrentVideo) {
      setCanControlVolume(false)
      return
    }

    const timerId = setTimeout(() => {
      setCanControlVolume(detectVolumeControlSupport())
    }, 0)

    return () => clearTimeout(timerId)
  }, [currentVideo?.video?.id, detectVolumeControlSupport, hasCurrentVideo])

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

  const readCurrentVolume = useCallback(() => {
    const node = mediaRef?.current
    if (node && typeof node.getInternalPlayer === 'function') {
      const internal = node.getInternalPlayer()
      if (internal && typeof internal.volume === 'number') return internal.volume
      if (internal && typeof internal.getVolume === 'function') return internal.getVolume()
    }
    if (node && typeof node.volume === 'number') return node.volume
    const el = document.querySelector('video, audio, castable-video')
    if (el && typeof el.volume === 'number') return el.volume
    return undefined
  }, [mediaRef])

  const handleNext = useCallback(() => {
    const v = readCurrentVolume()
    if (typeof v === 'number' && !Number.isNaN(v)) setVolume(v)
    onNextVideo(nextVideo)
  }, [nextVideo, onNextVideo, readCurrentVolume, setVolume])

  useEffect(() => {
    const apply = () => {
      const node = mediaRef?.current
      if (node && typeof node.setVolume === 'function') {
        node.setVolume(volume)
        return
      }
      if (node && typeof node.getInternalPlayer === 'function') {
        const internal = node.getInternalPlayer()
        if (internal && 'volume' in internal) {
          try { internal.volume = volume } catch { /* noop */ }
          return
        }
      }
      const el = document.querySelector('video, audio, castable-video')
      if (el && typeof el.volume === 'number') el.volume = volume
    }
    if (hasCurrentVideo && canControlVolume) {
      const t = setTimeout(apply, 0)
      return () => clearTimeout(t)
    }
  }, [canControlVolume, hasCurrentVideo, mediaRef, volume])

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
          <div className="player-video__quality-dropdown" ref={qualityMenuRef}>
            <button
              type="button"
              className="player-video__quality-trigger"
              onClick={() => setIsQualityMenuOpen((open) => !open)}
              aria-label={PLAYER_VIDEO.QUALITY}
              aria-haspopup="menu"
              aria-expanded={isQualityMenuOpen}
            >
              <span className="player-video__quality-trigger-sizer" aria-hidden>
                {[PLAYER_VIDEO.QUALITY_AUTO, ...playbackSources.map(formatSourceLabel)].reduce(
                  (longest, label) => (label.length > longest.length ? label : longest), ''
                )}
              </span>
              <span className="player-video__quality-trigger-label">{selectedQualityLabel}</span>
            </button>
            {isQualityMenuOpen && (
              <ul className="player-video__quality-menu" role="menu">
                <li>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={selectedSourceId === 'auto'}
                    className={`player-video__quality-option ${selectedSourceId === 'auto' ? 'player-video__quality-option--active' : ''}`}
                    onClick={() => {
                      const mediaElement = getMediaElement()
                      const currentTime = Number(mediaElement?.currentTime) || 0
                      const shouldPlay = Boolean(mediaElement && !mediaElement.paused && !mediaElement.ended)
                      pendingSeekRef.current = { time: currentTime, shouldPlay }
                      setSelectedSourceId('auto')
                      setIsQualityMenuOpen(false)
                    }}
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
                      onClick={() => {
                        const mediaElement = getMediaElement()
                        const currentTime = Number(mediaElement?.currentTime) || 0
                        const shouldPlay = Boolean(mediaElement && !mediaElement.paused && !mediaElement.ended)
                        pendingSeekRef.current = { time: currentTime, shouldPlay }
                        setSelectedSourceId(source.id)
                        setIsQualityMenuOpen(false)
                      }}
                    >
                      {formatSourceLabel(source)}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
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
