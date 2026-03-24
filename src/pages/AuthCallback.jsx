import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase/supabaseClient'
import { ROUTES_NAMES } from '../router/routesNames'
import Spinner from '../components/ui/Spinner'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Only proceed if this window was opened by an expected same-origin popup flow
    const isExpectedOrigin =
      window.opener && window.opener.location.origin === window.location.origin

    supabase.auth.getSession().then(({ data }) => {
      if (isExpectedOrigin) {
        const channel = new BroadcastChannel('auth')
        // Post a minimal signal — receivers must call supabase.auth.getSession() themselves
        channel.postMessage({ type: 'AUTH_COMPLETE' })
        channel.close()
        window.close()
        return
      }
      navigate(ROUTES_NAMES.ROOT, { replace: true })
    })
  }, [navigate])

  return (
    <div className="auth-callback">
      <Spinner size="large" />
    </div>
  )
}

export default AuthCallback
