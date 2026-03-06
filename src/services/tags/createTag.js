import apiClient from '../apiClient'

export const createTag = async (data = {}) => {
  return await apiClient.post('/tags', data)
}


