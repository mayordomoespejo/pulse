import apiClient from '../apiClient'

export const deleteTag = async (tagId) => {
  return await apiClient.delete(`/tags/${tagId}`)
}


