import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import List from '../components/common/List'
import PlaylistCard from '../components/playlist/PlaylistCard'
import PlaylistModalsWrapper from '../components/playlist/PlaylistModalsWrapper'
import CreateButton from '../components/ui/CreateButton'
import Heading from '../components/ui/Heading'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import SelectDateRange from '../components/ui/SelectDateRange'
import SelectTags from '../components/ui/SelectTags'
import useBreakpoint from '../hooks/useBreakpoint'
import usePlaylists from '../hooks/usePlaylists'
import { reorderPlaylists } from '../services/playlists/reorderPlaylists'
import usePlaylistModalStore from '../stores/playlistModalStore'

function PlaylistsPage() {
  const { t } = useTranslation()
  const { setIsOpenPlaylistForm, setSelectedPlaylist } = usePlaylistModalStore()
  const dragStartIdsRef = useRef([])
  const { isPhone } = useBreakpoint()

  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get('search')
  const tags = searchParams.get('tags')
  const page = +searchParams.get('page') || 1
  const dateStart = searchParams.get('date-start')
  const dateEnd = searchParams.get('date-end')

  const queryClient = useQueryClient()

  const {
    pagesCount,
    totalPlaylists,
    isLoadingPlaylists,
    playlists,
    isAllPendingPlaylists
  } = usePlaylists({ search, tags, page, dateStart, dateEnd })

  const reorderMutation = useMutation({
    mutationFn: (orderedIds) => reorderPlaylists(orderedIds),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['playlists'] }) },
  })

  const [parentPlaylists, playlistsRef, setPlaylists] = useDragAndDrop(playlists || [], {
    plugins: [animations()],
    dragHandle: '.playlist-card__grid-icon',
    draggingClass: 'is-dragging',
    dragPlaceholderClass: 'is-drag-placeholder',
    onDragstart: ({ values }) => {
      dragStartIdsRef.current = Array.isArray(values) ? values.map((v) => Number(v?.id)).filter(Number.isFinite) : []
    },
    onDragend: ({ values }) => {
      try {
        const startIds = Array.isArray(dragStartIdsRef.current) ? dragStartIdsRef.current : []
        const endIds = Array.isArray(values) ? values.map((v) => Number(v?.id)).filter(Number.isFinite) : []
        const changed = endIds.length !== startIds.length || endIds.some((id, i) => id !== startIds[i])
        if (changed && endIds.length > 0) reorderMutation.mutate(endIds)
      } finally {
        dragStartIdsRef.current = []
      }
    },
  })

  useEffect(() => {
    if (searchParams.get('page')) {
      const next = new URLSearchParams(searchParams)
      next.delete('page')
      setSearchParams(next)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tags])

  useEffect(() => {
    if (Array.isArray(playlists) && !isAllPendingPlaylists) {
      setPlaylists(playlists)
      return
    }

    if (Array.isArray(playlists) && playlists.length === 0) {
      setPlaylists([])
    }

  }, [playlists, isAllPendingPlaylists, setPlaylists])

  return (
    <div className="playlists-page" >
      <Heading title={t('PLAYLISTS_PAGE.TITLE')} as="h1" />
      <div className="playlists-page__main">
        <Heading title={t('PLAYLISTS_PAGE.HEADING')} as="h2" className="playlists-page__heading">
          {(!isPhone || (isPhone && !(isLoadingPlaylists || isAllPendingPlaylists))) &&
            <CreateButton
              label={t('PLAYLISTS_PAGE.CREATE_BUTTON')}
              onClick={() => {
                setSelectedPlaylist(null)
                setIsOpenPlaylistForm(true)
              }}
            />
          }
        </Heading>
        <div className="playlists-page__filters">
          <div className="playlists-page__inputs">
            <SelectDateRange />
            <SelectTags />
            <SearchInput />
          </div>
        </div>
        <List
          typeList="default"
          isLoading={isLoadingPlaylists || isAllPendingPlaylists}
          items={playlistsRef}
          ref={parentPlaylists}
          renderItem={(playlist) => (
            <PlaylistCard
              key={playlist?.id}
              playlist={playlist}
              dataLabel={playlist?.id}
            />
          )}
        />
      </div>
      <PlaylistModalsWrapper />
      {pagesCount > 1 &&
        <Pagination
          pagesCount={pagesCount}
          total={totalPlaylists}
        />}
    </div >
  )
}

export default PlaylistsPage
