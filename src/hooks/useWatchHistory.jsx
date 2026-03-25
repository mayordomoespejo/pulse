import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { DEFAULT_STALE_TIME } from '../constants/constants'
import { addToHistory, getWatchHistory } from '../services/watchHistory/watchHistoryService'
import { useAuthStore } from '../stores/authStore'

export function useWatchHistory(limit = 10) {
  const queryClient = useQueryClient()
  const { user } = useAuthStore()
  const userId = user?.uid ?? null

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['watch-history', userId, limit],
    queryFn: () => getWatchHistory(userId, limit),
    enabled: !!userId,
    staleTime: DEFAULT_STALE_TIME,
  })

  const { mutate: addMutate } = useMutation({
    mutationFn: (video) => addToHistory(userId, video),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watch-history', userId] }),
  })

  const addToHistoryMutation = useCallback((video) => addMutate(video), [addMutate])

  return { history, addToHistory: addToHistoryMutation, isLoading }
}
