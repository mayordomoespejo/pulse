import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import useBreakpoint from '../../hooks/useBreakpoint'
import { updatePlaylist } from '../../services/playlists/updatePlaylist'
import { getVideos } from '../../services/videos/getVideos'
import usePlaylistModalStore from '../../stores/playlistModalStore'
import List from '../common/List'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import SearchInput from '../ui/SearchInput'
import SelectTags from '../ui/SelectTags'
import VideoCardSelector from '../video/VideoCardSelector'

function PlaylistAddVideosModal() {
  const { t } = useTranslation()
  const PLAYLIST_ADD_VIDEOS_MODAL = t('PLAYLIST_ADD_VIDEOS_MODAL', { returnObjects: true })
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })
  const { isPhone } = useBreakpoint()

  const { setIsOpenPlaylistAddVideos, isOpenPlaylistAddVideos, selectedPlaylist, setSelectedPlaylist } = usePlaylistModalStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState(new Set((selectedPlaylist?.playlistItems ?? []).map((item) => item?.video?.id).filter(Boolean)))
  const [tags, setTags] = useState([])

  const playlistForVideos = selectedPlaylist
  const queryClient = useQueryClient()

  const {
    data: videosData,
    isPending: isPendingVideos,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['videos', searchTerm, tags],
    queryFn: ({ pageParam = 1 }) => getVideos({ search: searchTerm, tags, page: pageParam }),
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      const { currentPage, pagesCount } = lastPage?.data ?? {}
      if (typeof currentPage === 'number' && typeof pagesCount === 'number' && currentPage < pagesCount) {
        return lastPageParam + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: isOpenPlaylistAddVideos,
  })

  const videos = Array.isArray(videosData?.pages)
    ? videosData.pages.flatMap((p) => {
      if (Array.isArray(p?.videos)) return p.videos
      if (Array.isArray(p?.data?.videos)) return p.data.videos
      return []
    })
    : []
  const { mutate: addVideosMutate, isPending: isPendingAddVideos } = useMutation({
    mutationFn: ({ id, payload }) => updatePlaylist(id, payload),
  })

  const onClose = () => setIsOpenPlaylistAddVideos(false)

  const handleSaveVideos = async () => {
    const payload = {
      name: playlistForVideos?.name ?? '',
      tags: (playlistForVideos?.tags ?? []).map((t) => (typeof t === 'number' ? t : t?.id)).filter(Boolean),
      videos: Array.from(selectedIds),
    }

    addVideosMutate({ id: playlistForVideos?.id, payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['playlists'] })
        queryClient.invalidateQueries({ queryKey: ['playlist', playlistForVideos.id] })
        toast.success(PLAYLIST_ADD_VIDEOS_MODAL.TOAST.SUCCESS)
        onClose()
      },
      onError: () => {
        toast.error(PLAYLIST_ADD_VIDEOS_MODAL.TOAST.ERROR)
      },
    })
  }

  const handleToggleId = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
        return next
      }
      next.add(id)
      return next
    })
  }

  const count = selectedIds?.size ?? 0
  const countLabel = count === 0
    ? ''
    : (count === 1 ? `1 ${CONSTANTS.VIDEO}` : `${count} ${CONSTANTS.VIDEOS}`)
  const showActions = !isPhone || !(isPendingVideos || isPendingAddVideos)


  useEffect(() => {
    setSelectedIds(new Set((selectedPlaylist?.playlistItems ?? []).map((item) => item?.video?.id).filter(Boolean)))
  }, [selectedPlaylist])


  if (!isOpenPlaylistAddVideos) return null

  return (
    <>
      <Modal
        title={PLAYLIST_ADD_VIDEOS_MODAL.TITLE}
        subtitle={PLAYLIST_ADD_VIDEOS_MODAL.HELP}
        onClose={() => {
          setIsOpenPlaylistAddVideos(false)
          setSelectedPlaylist(null)
          onClose()
        }}
        className="playlist-add-videos-modal"
        classNameContent={`playlist-add-videos-modal__content ${isPendingVideos ? 'playlist-add-videos-modal__content--loading' : ''}`}
        actions={showActions ? (
          <Button
            className="playlist-add-videos-modal__save-button"
            onClick={handleSaveVideos}
            label={`${CONSTANTS.SAVE}${countLabel ? ` ${countLabel}` : ''}`}
            variant="secondary-filled"
            disabled={isPendingAddVideos}
          />
        ) : null}
        actionsAlignment="center"
        isFloating
      >
        <div className="playlist-add-videos-modal__inputs">
          <SearchInput
            useParams={false}
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder={PLAYLIST_ADD_VIDEOS_MODAL.SEARCH_PLACEHOLDER}
            className="playlist-add-videos-modal__input"
          />
          <SelectTags
            name="tags"
            isMulti
            className="playlist-add-videos-modal__input"
            useParams={false}
            onChange={(options) => setTags((options ?? []).map((opt) => opt.value))}
          />
        </div>

        <List
          typeList="scrollable"
          className="playlist-add-videos-modal__list"
          items={videos}
          isLoading={isPendingVideos}
          renderItem={(video) => (
            <VideoCardSelector
              video={video}
              toggleId={handleToggleId}
              isSelected={selectedIds?.has(video?.id)}
            />
          )}
        />
        {hasNextPage && !isFetchingNextPage && (
          <button onClick={() => fetchNextPage()} style={{ marginTop: 12 }}>
            {PLAYLIST_ADD_VIDEOS_MODAL.LOAD_MORE}
          </button>
        )}

      </Modal >
    </>
  )
}

export default PlaylistAddVideosModal
