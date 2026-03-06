import apiClient from '../apiClient'

export const updateVideo = async (id, data) => {
  return await apiClient.patch(`/videos/${id}`, data)
}
