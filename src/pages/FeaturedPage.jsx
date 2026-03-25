import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import List from '../components/common/List'
import Heading from '../components/ui/Heading'
import VideoCard from '../components/video/VideoCard'
import { getDefaultPexelsLocale } from '../constants/pexelsFilters'
import useBreakpoint from '../hooks/useBreakpoint'
import { useFavorites } from '../hooks/useFavorites'
import useGridColumns from '../hooks/useGridColumns'
import { useWatchHistory } from '../hooks/useWatchHistory'
import useVideosQuery from '../hooks/useVideosQuery'

/**
 * Home page with a curated popular videos feed.
 *
 * @returns {JSX.Element}
 */
const MOBILE_FEATURED_LIMIT = 5
const GRID_MIN_CARD_WIDTH = 290
const GRID_COLUMN_GAP = 20
const GRID_ROWS = 2

function FeaturedPage() {
  const { t, i18n } = useTranslation()
  const FEATURED_PAGE = t('FEATURED_PAGE', { returnObjects: true })
  const RECENTLY_WATCHED = t('RECENTLY_WATCHED', { returnObjects: true })
  const defaultLocale = getDefaultPexelsLocale(i18n.resolvedLanguage || i18n.language)
  const { isPhone } = useBreakpoint()
  const { isFavorite } = useFavorites()
  const { containerRef: listContainerRef, columns } = useGridColumns({ minCardWidth: GRID_MIN_CARD_WIDTH, columnGap: GRID_COLUMN_GAP })
  const [limit, setLimit] = useState(MOBILE_FEATURED_LIMIT)
  const { history } = useWatchHistory(limit)

  useEffect(() => {
    if (isPhone) {
      setLimit(MOBILE_FEATURED_LIMIT)
      return
    }

    const nextLimit = columns * GRID_ROWS
    setLimit((previousLimit) => (previousLimit === nextLimit ? previousLimit : nextLimit))
  }, [isPhone, columns])

  const { data, isLoading } = useVideosQuery({
    search: '',
    page: 1,
    limit,
    source: 'popular',
    locale: defaultLocale,
  })
  const { videos = [] } = data?.data ?? {}

  return (
    <div className="featured-page">
      <div className="featured-page__header">
        <Heading title={FEATURED_PAGE.TITLE} as="h1" showArrow className="featured-page__title" />
      </div>

      <div className="featured-page__hero">
        <div className="featured-page__hero-content">
          <p className="featured-page__hero-text">{FEATURED_PAGE.HERO_TEXT}</p>
        </div>
      </div>

      <div className="featured-page__list-container" ref={listContainerRef}>
        <List
          typeList="default"
          isLoading={isLoading}
          items={videos}
          renderItem={(video) => <VideoCard key={video?.id} video={video} isFavorite={isFavorite(video?.id)} />}
        />
      </div>

      {history.length > 0 && (
        <div className="featured-page__recently-watched">
          <h2 className="featured-page__section-title">{RECENTLY_WATCHED.TITLE}</h2>
          <div className="featured-page__recently-watched-row">
            {history.map((entry) => (
              <div key={entry.id} className="featured-page__recently-watched-item">
                <VideoCard video={entry.video_data} isFavorite={isFavorite(entry.video_data?.id)} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeaturedPage
