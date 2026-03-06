import apiClient from '../apiClient'

export const getTags = async () => {
  try {
    const response = await apiClient.get('/tags')

    return { ...response, ok: true }
  } catch (error) {
    return { ...error, ok: false }
  }
}
