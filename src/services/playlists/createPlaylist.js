import apiClient from '../apiClient'

export const createPlaylist = async (data = {}) => {
  return await apiClient.post('/playlists', data)
}
