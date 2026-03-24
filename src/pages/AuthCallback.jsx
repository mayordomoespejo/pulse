import { useEffect } from 'react'

/**
 * OAuth callback page — opened as a popup by the Google login flow.
 * Notifies the opener via BroadcastChannel and closes itself.
 */
function AuthCallback() {
  useEffect(() => {
    const channel = new BroadcastChannel('auth')
    channel.postMessage({ type: 'AUTH_COMPLETE' })
    channel.close()
    window.close()
  }, [])

  return null
}

export default AuthCallback
