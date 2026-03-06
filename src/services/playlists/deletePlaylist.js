import apiClient from '../apiClient'

export const deletePlaylist = async (playlistsIds) => {
  return await apiClient.delete('/playlists', { data: { playlists: playlistsIds } })
}