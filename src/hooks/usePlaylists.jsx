import { useQueries, useQuery } from '@tanstack/react-query'

import { DEFAULT_LIMIT } from '../constants/constants'
import { getOnePlaylist } from '../services/playlists/getOnePlaylist'
import { getPlaylists } from '../services/playlists/getPlaylists'

const usePlaylists = ({ search, tags, page, dateStart, dateEnd, limit = DEFAULT_LIMIT }) => {

  const { data: playlistsData, isLoading: isLoadingPlaylists } = useQuery({
    queryKey: ['playlists', search, tags, page, dateStart, dateEnd],
    queryFn: () => getPlaylists({
      search,
      tags,
      page,
      limit,
      ...(dateStart && { dateStart: +new Date(dateStart) / 1000 }),
      ...(dateEnd && { dateEnd: +new Date(dateEnd) / 1000 })
    }),
    refetchOnWindowFocus: false,
  })

  const { playlists, pagesCount, totalPlaylists } = playlistsData?.data ?? {}

  const combined = useQueries({
    queries: (Array.isArray(playlists) ? playlists : []).map(({ id }) => ({
      queryKey: ['playlist', id],
      queryFn: () => getOnePlaylist(id),
      select: (resp) => resp?.data,
    })),
    combine: (results) => {
      const detailedById = results.reduce((acc, result) => {
        const data = result?.data
        const id = data?.id
        if (id != null) acc[id] = data
        return acc
      }, {})

      const formattedPlaylists = (Array.isArray(playlists) ? playlists : []).map((playlist) => {
        const detailed = detailedById?.[playlist?.id]?.playlistItems ?? {}
        return { ...playlist, playlistItems: Array.isArray(detailed) ? detailed : [] }
      })
      return {
        playlists: formattedPlaylists,
        isAllPending: results?.length > 0 && results?.every((result) => result?.isPending ?? false),
      }
    },
  })

  return {
    pagesCount,
    totalPlaylists,
    isLoadingPlaylists,
    playlists: combined.playlists,
    isAllPendingPlaylists: combined.isAllPending,
  }
}

export default usePlaylists
