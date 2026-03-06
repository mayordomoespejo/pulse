import apiClient from '../apiClient'

export const getOnePlaylist = async (playlistId) => {
  return await apiClient.get(`/playlists/${playlistId}`)
}
