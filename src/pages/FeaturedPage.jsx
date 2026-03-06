import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import List from '../components/common/List'
import Heading from '../components/ui/Heading'
import VideoCard from '../components/video/VideoCard'
import { getDefaultPexelsLocale } from '../constants/pexelsFilters'
import useBreakpoint from '../hooks/useBreakpoint'
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
  const defaultLocale = getDefaultPexelsLocale(i18n.resolvedLanguage || i18n.language)
  const { isPhone } = useBreakpoint()
  const listContainerRef = useRef(null)
  const [limit, setLimit] = useState(MOBILE_FEATURED_LIMIT)

  useEffect(() => {
    if (isPhone) {
      setLimit(MOBILE_FEATURED_LIMIT)
      return
    }

    const updateLimit = () => {
      const availableWidth = listContainerRef.current?.clientWidth || window.innerWidth
      const columns = Math.max(
        1,
        Math.floor((availableWidth + GRID_COLUMN_GAP) / (GRID_MIN_CARD_WIDTH + GRID_COLUMN_GAP)),
      )
      const nextLimit = columns * GRID_ROWS
      setLimit((previousLimit) => (previousLimit === nextLimit ? previousLimit : nextLimit))
    }

    updateLimit()

    const resizeObserver = new ResizeObserver(updateLimit)
    if (listContainerRef.current) {
      resizeObserver.observe(listContainerRef.current)
    }

    window.addEventListener('resize', updateLimit)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateLimit)
    }
  }, [isPhone])

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
          renderItem={(video) => <VideoCard key={video?.id} video={video} />}
        />
      </div>
    </div>
  )
}

export default FeaturedPage
