import { useEffect, useState } from 'react'

function getIsFullscreen() {
  // Standard + WebKit fallback (Safari)
  return Boolean(document.fullscreenElement || document.webkitFullscreenElement)
}

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(getIsFullscreen())

  useEffect(() => {
    const onChange = () => setIsFullscreen(getIsFullscreen())
    document.addEventListener('fullscreenchange', onChange)
    // Safari
    document.addEventListener('webkitfullscreenchange', onChange)
    return () => {
      document.removeEventListener('fullscreenchange', onChange)
      document.removeEventListener('webkitfullscreenchange', onChange)
    }
  }, [])

  return isFullscreen
}

export default useFullscreen


