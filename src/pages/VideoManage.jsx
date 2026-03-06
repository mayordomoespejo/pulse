import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { FilterIcon } from '../assets/icons/icons'
import List from '../components/common/List'
import Heading from '../components/ui/Heading'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import MediaSearchModal from '../components/video/MediaSearchModal'
import VideoCard from '../components/video/VideoCard'
import {
  getDefaultPexelsLocale,
  PEXELS_VIDEO_LOCALES,
  PEXELS_VIDEO_ORIENTATIONS,
  PEXELS_VIDEO_SIZES,
} from '../constants/pexelsFilters'
import useBreakpoint from '../hooks/useBreakpoint'
import useVideosQuery from '../hooks/useVideosQuery'

/**
 * Searchable videos library page backed by Pexels API.
 *
 * @returns {JSX.Element}
 */
const MOBILE_EXPLORE_LIMIT = 10
const GRID_MIN_CARD_WIDTH = 290
const GRID_COLUMN_GAP = 20
const EXPLORE_GRID_ROWS = 3

function VideoManage() {
  const [isOpenSearch, setIsOpenSearch] = useState(false)
  const { t, i18n } = useTranslation()
  const VIDEO_MANAGE = t('VIDEO_MANAGE', { returnObjects: true })
  const { isPhone } = useBreakpoint()
  const listContainerRef = useRef(null)
  const [limit, setLimit] = useState(MOBILE_EXPLORE_LIMIT)

  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search') || ''
  const orientationParam = searchParams.get('orientation') || ''
  const sizeParam = searchParams.get('size') || ''
  const localeParam = searchParams.get('locale') || ''
  const defaultLocale = getDefaultPexelsLocale(i18n.resolvedLanguage || i18n.language)
  const orientation = PEXELS_VIDEO_ORIENTATIONS.includes(orientationParam) ? orientationParam : ''
  const size = PEXELS_VIDEO_SIZES.includes(sizeParam) ? sizeParam : ''
  const locale = PEXELS_VIDEO_LOCALES.includes(localeParam) ? localeParam : defaultLocale
  const page = Number(searchParams.get('page')) || 1

  useEffect(() => {
    if (isPhone) {
      setLimit(MOBILE_EXPLORE_LIMIT)
      return
    }

    const updateLimit = () => {
      const availableWidth = listContainerRef.current?.clientWidth || window.innerWidth
      const columns = Math.max(
        1,
        Math.floor((availableWidth + GRID_COLUMN_GAP) / (GRID_MIN_CARD_WIDTH + GRID_COLUMN_GAP)),
      )
      const nextLimit = columns * EXPLORE_GRID_ROWS
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

  const { data: videosData, isLoading } = useVideosQuery({
    search,
    orientation,
    size,
    locale,
    page,
    limit,
    source: 'search',
  })

  const hasActiveFilters = orientation || size || localeParam

  const handleSearch = (filters) => {
    const next = new URLSearchParams(searchParams)
    if (filters.orientation) next.set('orientation', filters.orientation)
    else next.delete('orientation')
    if (filters.size) next.set('size', filters.size)
    else next.delete('size')
    if (filters.locale) next.set('locale', filters.locale)
    else next.delete('locale')
    next.delete('page')
    setSearchParams(next)
  }

  const { videos = [], pagesCount = 1, totalVideos = 0 } = videosData?.data ?? {}

  return (
    <div className="video-manage">
      <Heading title={VIDEO_MANAGE.TITLE} showArrow />
      <div className="video-manage__main">
        <div className="video-manage__filters">
          <div className="video-manage__inputs">
            <SearchInput placeholder={VIDEO_MANAGE.SEARCH_PLACEHOLDER} />
            <button
              type="button"
              className={`video-manage__filter-btn ${hasActiveFilters ? 'video-manage__filter-btn--active' : ''}`}
              onClick={() => setIsOpenSearch(true)}
              aria-label={t('MEDIA_SEARCH.TITLE')}
            >
              <FilterIcon stroke="currentColor" width={18} height={18} />
            </button>
          </div>
        </div>

        <div className="video-manage__list-container" ref={listContainerRef}>
          <List
            typeList="default"
            isLoading={isLoading}
            items={videos}
            renderItem={(video) => (
              <VideoCard key={video?.id} video={video} />
            )}
          />
        </div>
      </div>

      {isOpenSearch && (
        <MediaSearchModal
          onClose={() => setIsOpenSearch(false)}
          onSearch={handleSearch}
          initialValues={{ query: search, orientation, size, locale }}
        />
      )}

      {pagesCount > 1 && (
        <Pagination pagesCount={pagesCount} total={totalVideos} />
      )}
    </div>
  )
}

export default VideoManage
