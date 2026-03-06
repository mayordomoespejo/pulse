import apiClient from '../apiClient'

export const updateTag = async (tagId, data = {}) => {
  return await apiClient.patch(`/tags/${tagId}`, data)
}


