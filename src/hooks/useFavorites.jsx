import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addFavorite, getFavorites, removeFavorite } from '../services/favorites/favoritesService'

export function useFavorites() {
  const queryClient = useQueryClient()

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  })

  const favoriteIds = new Set(favorites.map((f) => f.video_id))

  const isFavorite = (videoId) => favoriteIds.has(String(videoId))

  const { mutate: addMutate } = useMutation({
    mutationFn: addFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  })

  const { mutate: removeMutate } = useMutation({
    mutationFn: removeFavorite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
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
