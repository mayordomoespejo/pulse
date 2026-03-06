import apiClient from '../apiClient'

export const createVideo = async ({ title, file, tags }) => {

  const formData = new FormData()
  if (title) formData.append('title', title)
  if (file) formData.append('file', file)
  if (tags) formData.append('tags', JSON.stringify(tags))

  return await apiClient.post('/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
