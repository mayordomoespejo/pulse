import { DEFAULT_LIMIT } from '../../constants/constants'
import { PEXELS_VIDEO_LOCALES, PEXELS_VIDEO_ORIENTATIONS, PEXELS_VIDEO_SIZES } from '../../constants/pexelsFilters'
import apiClient from '../apiClient'

import { mapPexelsListResponse } from './mappers'

/**
 * Fetches videos from Pexels using either `search` or `popular` mode.
 *
 * @param {Object} options Query options.
 * @param {string} [options.search=''] Search text.
 * @param {number} [options.page=1] 1-based page index.
 * @param {number} [options.limit=DEFAULT_LIMIT] Amount of items per page.
 * @param {'popular'|'search'} [options.source='search'] Source endpoint selector.
 * @returns {Promise<{data: {videos: Array, pagesCount: number, totalVideos: number, page: number, perPage: number}}>} Normalized payload.
 */
export const getVideos = async ({ search = '', page = 1, limit = DEFAULT_LIMIT, source = 'search', orientation = '', size = '', locale = '' }) => {
  const params = new URLSearchParams()
  params.append('page', String(page))
  params.append('per_page', String(limit))

  const cleanSearch = search.trim()
  const endpoint = source === 'popular' ? '/popular' : '/search'

  if (source !== 'popular') {
    params.append('query', cleanSearch || 'popular')
    if (PEXELS_VIDEO_ORIENTATIONS.includes(orientation)) params.append('orientation', orientation)
    if (PEXELS_VIDEO_SIZES.includes(size)) params.append('size', size)
    if (PEXELS_VIDEO_LOCALES.includes(locale)) params.append('locale', locale)
  }

  const response = await apiClient.get(`${endpoint}?${params.toString()}`)

  return {
    ...response,
    data: mapPexelsListResponse(response?.data),
  }
}
