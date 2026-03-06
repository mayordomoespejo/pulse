import { DEFAULT_LIMIT } from '../../constants/constants'
import apiClient from '../apiClient'

export const getPlaylists = async ({ search, tags = [], page, limit = DEFAULT_LIMIT, dateStart, dateEnd }) => {
  const params = new URLSearchParams()
  if (page) params.append('page', page)
  if (limit) params.append('limit', limit)
  if (search) params.append('search', search)
  if (tags?.length > 0) params.append('tags', tags)
  if (dateStart) params.append('date-start', dateStart)
  if (dateEnd) params.append('date-end', dateEnd)

  return await apiClient.get(`/playlists?${params.toString()}`)
}
