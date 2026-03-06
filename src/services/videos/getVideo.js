import apiClient from '../apiClient'

import { mapPexelsVideo } from './mappers'

/**
 * Fetches a single video from Pexels API.
 *
 * @param {string|number} id Pexels video ID.
 * @returns {Promise<{data: Object}>} Normalized video payload.
 */
export const getVideo = async (id) => {
  const response = await apiClient.get(`/videos/${id}`)

  return {
    ...response,
    data: mapPexelsVideo(response?.data),
  }
}
