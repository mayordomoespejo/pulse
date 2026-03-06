import apiClient from '../apiClient'

export const deleteVideos = async (videoIds = []) => {
  return await apiClient.delete('/videos', {
    data: { videos: videoIds },
  })
}
