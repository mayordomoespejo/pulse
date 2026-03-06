import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'

import Navigation from '../components/ui/Navigation'

function MainLayout() {
  const { t } = useTranslation()
  const PEXELS = t('PEXELS', { returnObjects: true })

  return (
    <div className="main-layout">
      <Navigation />
      <main className="main-layout__content">
        <div className="main-layout__body">
          <Outlet />
        </div>
        <footer className="main-layout__footer">
          <p className="featured-page__credits-link">
            <a href="https://www.pexels.com" target="_blank" rel="noreferrer">{PEXELS.PROVIDED_BY}</a>
          </p>
        </footer>
      </main>
    </div>
  )
}

export default MainLayout
