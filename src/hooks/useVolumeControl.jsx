import { useCallback, useEffect, useState } from 'react'

/**
 * useVolumeControl — handles reading, applying, and detecting volume control
 * support for a media element accessed via a mediaRef (ReactPlayer or raw element).
 *
 * @param {React.RefObject} mediaRef  - ref to the ReactPlayer / media node
 * @param {number}  volume            - desired volume level (from store)
 * @param {boolean} hasCurrentVideo   - whether a video is currently loaded
 * @returns {{ canControlVolume: boolean, readCurrentVolume: () => number|undefined }}
 */
const useVolumeControl = (mediaRef, volume, hasCurrentVideo) => {
  const [canControlVolume, setCanControlVolume] = useState(true)

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

  // Detect volume control support whenever the video changes
  useEffect(() => {
    if (!hasCurrentVideo) {
      setCanControlVolume(false)
      return
    }

    const timerId = setTimeout(() => {
      setCanControlVolume(detectVolumeControlSupport())
    }, 0)

    return () => clearTimeout(timerId)
  }, [hasCurrentVideo, detectVolumeControlSupport])

  // Apply the persisted volume level to the media element
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

  return { canControlVolume, readCurrentVolume }
}

export default useVolumeControl
