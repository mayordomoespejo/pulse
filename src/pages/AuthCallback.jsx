import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Spinner from '../components/ui/Spinner'
import { ROUTES_NAMES } from '../router/routesNames'
import { supabase } from '../services/supabase/supabaseClient'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const isExpectedOrigin =
      window.opener && window.opener.location.origin === window.location.origin

    supabase.auth.getSession().then(() => {
      if (isExpectedOrigin) {
        const channel = new BroadcastChannel('auth')
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
