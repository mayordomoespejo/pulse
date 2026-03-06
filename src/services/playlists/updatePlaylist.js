import apiClient from '../apiClient'

export const updatePlaylist = async (playlistId, data = {}) => {
  return await apiClient.patch(`/playlists/${playlistId}`, data)
}
