import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { addToHistory, getWatchHistory } from '../services/watchHistory/watchHistoryService'

export function useWatchHistory(limit = 10) {
  const queryClient = useQueryClient()

  const { data: history = [], isLoading } = useQuery({
    queryKey: ['watch-history', limit],
    queryFn: () => getWatchHistory(limit),
  })

  const { mutate: addMutate } = useMutation({
    mutationFn: addToHistory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['watch-history'] }),
  })

  const addToHistoryMutation = useCallback((video) => addMutate(video), [addMutate])

  return { history, addToHistory: addToHistoryMutation, isLoading }
}
