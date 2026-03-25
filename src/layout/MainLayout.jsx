import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import { PEXELS_URL } from '../constants/constants'
import ErrorBoundary from '../components/common/ErrorBoundary'
import Navigation from '../components/ui/Navigation'

function MainLayout() {
  const { t } = useTranslation()
  const PEXELS = t('PEXELS', { returnObjects: true })

  return (
    <div className="main-layout">
      <Navigation />
      <main className="main-layout__content">
        <div className="main-layout__body">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
        <footer className="main-layout__footer">
          <p className="main-layout__footer-credits">
            <a href={PEXELS_URL} target="_blank" rel="noreferrer">{PEXELS.PROVIDED_BY}</a>
          </p>
        </footer>
      </main>
    </div>
  )
}

export default MainLayout
