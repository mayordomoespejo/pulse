import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase/supabaseClient'
import { ROUTES_NAMES } from '../router/routesNames'
import Spinner from '../components/ui/Spinner'

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (window.opener) {
        const channel = new BroadcastChannel('auth')
        channel.postMessage({ type: 'AUTH_COMPLETE', session: data.session })
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
