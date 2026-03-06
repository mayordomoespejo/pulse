import apiClient from '../apiClient'

export const reorderPlaylists = async (orderedIds = []) => {
  return await apiClient.patch('/playlists/reorder', {
    orderedIds,
  })
}


