import { useQuery } from '@tanstack/react-query'

import { DEFAULT_LIMIT, DEFAULT_STALE_TIME } from '../constants/constants'
import { getVideos } from '../services/videos/getVideos'

/**
 * React Query wrapper for paginated Pexels video data.
 *
 * @param {Object} params
 * @param {string} [params.search=''] Search term.
 * @param {number} [params.page=1] 1-based page index.
 * @param {number} [params.limit=DEFAULT_LIMIT] Items per page.
 * @param {'popular'|'search'} [params.source='search'] Pexels endpoint to use.
 * @param {string} [params.orientation=''] Video orientation filter.
 * @param {string} [params.size=''] Video size filter.
 * @param {string} [params.locale=''] Locale filter.
 * @returns {import('@tanstack/react-query').UseQueryResult}
 */
function useVideosQuery({ search = '', page = 1, limit = DEFAULT_LIMIT, source = 'search', orientation = '', size = '', locale = '' }) {
  return useQuery({
    queryKey: ['videos', source, search, page, limit, orientation, size, locale],
    queryFn: () => getVideos({ search, page, limit, source, orientation, size, locale }),
    refetchOnWindowFocus: false,
    staleTime: DEFAULT_STALE_TIME,
  })
}

export default useVideosQuery
