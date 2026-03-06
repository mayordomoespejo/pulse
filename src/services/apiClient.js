import axios from 'axios'

import { PEXELS_API_URL } from '../constants/constants'

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY

const apiClient = axios.create({
  baseURL: PEXELS_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  if (PEXELS_API_KEY) {
    config.headers.Authorization = PEXELS_API_KEY
  }

  return config
})

export default apiClient
