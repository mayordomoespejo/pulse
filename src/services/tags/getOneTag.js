import apiClient from '../apiClient'

export const getOneTag = async (tagId) => {
  return await apiClient.get(`/tags/${tagId}`)
}


