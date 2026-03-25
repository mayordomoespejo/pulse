import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { DEFAULT_STALE_TIME } from '../constants/constants'
import { addFavorite, getFavorites, removeFavorite } from '../services/favorites/favoritesService'
import { useAuthStore } from '../stores/authStore'

export function useFavorites() {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const userId = user?.uid ?? null

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
  })

  const favoriteIds = new Set(favorites.map((f) => f.video_id))

  const isFavorite = (videoId) => favoriteIds.has(String(videoId))

  const { mutate: addMutate } = useMutation({
    mutationFn: (video) => addFavorite(userId, video),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites', userId] }),
  })

  const { mutate: removeMutate } = useMutation({
    mutationFn: (videoId) => removeFavorite(userId, videoId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites', userId] }),
  })

  const toggleFavorite = (video) => {
    if (isFavorite(video.id)) {
      removeMutate(String(video.id))
    } else {
      addMutate(video)
    }
  }

  return { favorites, isFavorite, toggleFavorite, isLoading }
}
