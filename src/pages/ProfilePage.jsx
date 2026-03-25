import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from '../components/ui/Button'
import Heading from '../components/ui/Heading'
import Modal from '../components/ui/Modal'
import Spinner from '../components/ui/Spinner'
import StatCounter from '../components/ui/StatCounter'
import { useFavorites } from '../hooks/useFavorites'
import { useWatchHistory } from '../hooks/useWatchHistory'
import { ROUTES_NAMES } from '../router/routesNames'
import { clearHistory } from '../services/watchHistory/watchHistoryService'
import { clearFavorites } from '../services/supabase/favoritesService'
import { useAuthStore } from '../stores/authStore'

function ProfilePage() {
  const { t } = useTranslation()
  const PROFILE = t('PROFILE', { returnObjects: true })
  const navigate = useNavigate()
  const { user, signOut, reauthenticateWithGoogle } = useAuthStore()
  const [deleteError, setDeleteError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const { favorites } = useFavorites()
  const { history } = useWatchHistory()

  const handleLogout = async () => {
    await signOut().catch(() => {})
    navigate(ROUTES_NAMES.LOGIN, { replace: true })
  }

  const handleDeleteAccount = () => {
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false)
    const attemptDelete = async () => {
      if (user) {
        await clearHistory(user.uid)
        await clearFavorites(user.uid)
        await user.delete()
      }
    }
    try {
      await attemptDelete()
      localStorage.removeItem('video-store')
      navigate(ROUTES_NAMES.LOGIN)
    } catch (err) {
      if (err?.code === 'auth/requires-recent-login') {
        try {
          await reauthenticateWithGoogle()
          await attemptDelete()
          localStorage.removeItem('video-store')
          navigate(ROUTES_NAMES.LOGIN)
        } catch (retryErr) {
          setDeleteError(retryErr?.message || t('CONSTANTS.GENERAL_ERROR'))
        }
      } else {
        setDeleteError(err?.message || t('CONSTANTS.GENERAL_ERROR'))
      }
    }
  }

  if (!user) {
    return <div className="profile-page profile-page--loading"><Spinner size="large" /></div>
  }

  const displayName = user.displayName || user.email
  const initials = (user.displayName || user.email || '')
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
          {user.displayName && <p className="profile-page__email">{user.email}</p>}
        </div>
      </div>

      <div className="profile-page__stats">
        <div className="profile-page__stat">
          <span className="profile-page__stat-value"><StatCounter value={favorites.length} /></span>
          <span className="profile-page__stat-label">{PROFILE.FAVORITES}</span>
        </div>
        <div className="profile-page__stat">
          <span className="profile-page__stat-value"><StatCounter value={history.length} /></span>
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
        {deleteError && (
          <p className="profile-page__error" role="alert">{deleteError}</p>
        )}
      </div>

      {showDeleteModal && (
        <Modal
          title={PROFILE.DELETE_TITLE}
          onClose={() => setShowDeleteModal(false)}
          actionsAlignment="space-between"
          actions={
            <>
              <Button
                variant="secondary"
                label={PROFILE.DELETE_CANCEL}
                onClick={() => setShowDeleteModal(false)}
              />
              <Button
                variant="remove"
                label={PROFILE.DELETE_CONFIRM_BTN}
                onClick={handleConfirmDelete}
              />
            </>
          }
        >
          <p>{PROFILE.DELETE_CONFIRM}</p>
        </Modal>
      )}
    </div>
  )
}

export default ProfilePage
