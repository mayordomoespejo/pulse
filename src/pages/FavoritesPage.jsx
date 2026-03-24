import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import List from '../components/common/List'
import Heading from '../components/ui/Heading'
import VideoCard from '../components/video/VideoCard'
import { useFavorites } from '../hooks/useFavorites'
import { ROUTES_NAMES } from '../router/routesNames'

function FavoritesPage() {
  const { t } = useTranslation()
  const FAVORITES = t('FAVORITES_PAGE', { returnObjects: true })
  const { favorites, isLoading } = useFavorites()

  const videos = favorites.map((f) => f.video_data)

  return (
    <div className="favorites-page">
      <div className="favorites-page__header">
        <Heading title={FAVORITES.TITLE} as="h1" showArrow className="favorites-page__title" />
      </div>

      {!isLoading && videos.length === 0 ? (
        <div className="favorites-page__empty">
          <p className="favorites-page__empty-text">{FAVORITES.EMPTY}</p>
          <Link to={ROUTES_NAMES.ROOT} className="favorites-page__empty-link">
            {FAVORITES.BROWSE}
          </Link>
        </div>
      ) : (
        <List
          typeList="default"
          isLoading={isLoading}
          items={videos}
          renderItem={(video) => <VideoCard key={video?.id} video={video} />}
        />
      )}
    </div>
  )
}

export default FavoritesPage
