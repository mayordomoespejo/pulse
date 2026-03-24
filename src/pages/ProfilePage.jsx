import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import Spinner from '../components/ui/Spinner'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchHistory } from '../hooks/useWatchHistory'
import { ROUTES_NAMES } from '../router/routesNames'
import { logout } from '../services/auth/login'
import { supabase } from '../services/supabase/supabaseClient'
import { clearToken, getUser } from '../utils/auth'

function ProfilePage() {
  const { t } = useTranslation()
  const PROFILE = t('PROFILE', { returnObjects: true })
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const { favorites } = useFavorites()
  const { history } = useWatchHistory()

  useEffect(() => {
    getUser().then(setUser)
  }, [])

  const handleLogout = async () => {
    await logout().catch(() => {})
    clearToken()
    navigate(ROUTES_NAMES.LOGIN, { replace: true })
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm(PROFILE.DELETE_CONFIRM)) return
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (authUser) {
        await supabase.from('watch_history').delete().eq('user_id', authUser.id)
        await supabase.from('favorites').delete().eq('user_id', authUser.id)
        // Note: deleting the record from auth.users requires a Supabase service-role key
        // (admin privileges), which must never be exposed in a client-side app.
        // The auth record is therefore left in place; the user's personal data (watch
        // history and favorites) has already been erased above. To fully remove the
        // auth record, call a server-side edge function or Supabase admin API endpoint.
      }
      await supabase.auth.signOut()
      clearToken()
      navigate(ROUTES_NAMES.LOGIN)
    } catch (err) {
      console.error('Delete account failed', err)
    }
  }

  if (!user) {
    return <div className="profile-page profile-page--loading"><Spinner size="large" /></div>
  }

  const displayName = user.user_metadata?.full_name || user.email
  const initials = (user.user_metadata?.full_name || user.email || '')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')

  return (
    <div className="profile-page">
      <div className="profile-page__header">
        <Heading title={PROFILE.TITLE} as="h1" showArrow />
      </div>

      <div className="profile-page__user">
        <div className="profile-page__avatar-wrap">
          <div className="profile-page__avatar profile-page__avatar--initial">{initials}</div>
        </div>
        <div className="profile-page__info">
          <p className="profile-page__name">{displayName}</p>
          <p className="profile-page__email">{user.email}</p>
        </div>
      </div>

      <div className="profile-page__stats">
        <div className="profile-page__stat">
          <span className="profile-page__stat-value">{favorites.length}</span>
          <span className="profile-page__stat-label">{PROFILE.FAVORITES}</span>
        </div>
        <div className="profile-page__stat">
          <span className="profile-page__stat-value">{history.length}</span>
          <span className="profile-page__stat-label">{PROFILE.WATCHED}</span>
        </div>
      </div>

      <div className="profile-page__actions">
        <Button
          className="profile-page__logout"
          variant="secondary"
          label={PROFILE.LOGOUT}
          onClick={handleLogout}
        />
        <button
          className="profile-page__delete-btn"
          onClick={handleDeleteAccount}
        >
          {PROFILE.DELETE_ACCOUNT}
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
