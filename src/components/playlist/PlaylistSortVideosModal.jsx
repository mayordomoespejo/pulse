import { animations } from '@formkit/drag-and-drop'
import { useDragAndDrop } from '@formkit/drag-and-drop/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

import useBreakpoint from '../../hooks/useBreakpoint'
import { getOnePlaylist } from '../../services/playlists/getOnePlaylist'
import { updatePlaylist } from '../../services/playlists/updatePlaylist'
import usePlaylistModalStore from '../../stores/playlistModalStore'
import List from '../common/List'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import VideoCardSelector from '../video/VideoCardSelector'

function PlaylistSortVideosModal() {
  const { t } = useTranslation()
  const { isPhone } = useBreakpoint()
  const {
    setIsOpenPlaylistSortVideos,
    isOpenPlaylistSortVideos,
    selectedPlaylist,
  } = usePlaylistModalStore()

  const queryClient = useQueryClient()
  const playlistId = selectedPlaylist?.id

  const { data, isPending } = useQuery({
    queryKey: ['playlist', playlistId],
    queryFn: () => getOnePlaylist(playlistId),
    enabled: Boolean(isOpenPlaylistSortVideos && playlistId),
    select: (resp) => resp?.data,
    refetchOnWindowFocus: false,
    placeholderData: (prev) => prev,
  })

  const videos = useMemo(() => {
    const playlistItems = Array.isArray(data?.playlistItems) ? data.playlistItems : []
    return playlistItems.map((playlistItem) => ({
      id: playlistItem?.video?.id,
      title: playlistItem?.video?.name ?? playlistItem?.video?.title ?? '',
      thumbnailUrl: playlistItem?.video?.thumbnailUrl ?? playlistItem?.thumbnailUrl,
      url: playlistItem?.video?.url ?? playlistItem?.url,
      duration: playlistItem?.video?.duration ?? playlistItem?.duration,
      tags: playlistItem?.video?.tags ?? playlistItem?.tags,
    }))
      .filter((v) => v?.id)
  }, [data?.playlistItems])
  const [parent, itemsRef, setItems] = useDragAndDrop([], {
    plugins: [animations()],
    dragHandle: '.video-card-selector__grid-icon',
    draggingClass: 'is-dragging',
    dragPlaceholderClass: 'is-drag-placeholder',
  })

  useEffect(() => {
    if (isOpenPlaylistSortVideos && Array.isArray(videos)) {
      setItems(videos)
    }
  }, [videos, setItems, isOpenPlaylistSortVideos])

  const { mutate: updateOrder, isPending: isPendingSave } = useMutation({
    mutationFn: ({ id, payload }) => updatePlaylist(id, payload),
  })
  const showActions = !isPhone || !(isPending || isPendingSave)

  const onClose = () => setIsOpenPlaylistSortVideos(false)

  const handleSaveOrder = () => {
    const orderedVideoIds = (Array.isArray(itemsRef) ? itemsRef : [])
      .map((it) => it?.id)
      .filter(Boolean)

    const payload = {
      name: data?.name ?? selectedPlaylist?.name ?? '',
      tags: (Array.isArray(data?.tags) ? data.tags : selectedPlaylist?.tags ?? [])
        .map((t) => (typeof t === 'number' ? t : t?.id))
        .filter(Boolean),
      videos: orderedVideoIds,
    }

    updateOrder({ id: playlistId, payload }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['playlists'] })
        queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] })
        toast.success(t('PLAYLIST_SORT_VIDEOS_MODAL.TOAST.SUCCESS'))
        setItems([])
        onClose()
      },
      onError: () => {
        toast.error(t('PLAYLIST_SORT_VIDEOS_MODAL.TOAST.ERROR'))
      },
    })
  }

  if (!isOpenPlaylistSortVideos) return null

  return (
    <>
      <Modal
        title={t('PLAYLIST_SORT_VIDEOS_MODAL.TITLE')}
        subtitle={t('PLAYLIST_SORT_VIDEOS_MODAL.SUBTITLE')}
        onClose={onClose}
        className="playlist-sort-videos"
        classNameContent={`playlist-sort-videos__content ${isPending ? 'playlist-sort-videos__content--loading' : ''}`}
        isFloating
        dragEnabled={false}
        actions={showActions ? (
          <Button
            onClick={handleSaveOrder}
            label={isPendingSave ? t('PLAYLIST_SORT_VIDEOS_MODAL.SAVING') : t('PLAYLIST_SORT_VIDEOS_MODAL.SAVE_ORDER')}
            variant="secondary-filled"
            disabled={isPendingSave}
          />
        ) : null}
        actionsAlignment="center"

      >
        <List
          className="playlist-sort-videos__list"
          typeList="scrollable"
          isLoading={isPending}
          items={itemsRef}
          ref={parent}
          renderItem={(item) => (
            <VideoCardSelector video={item} isDragging />
          )}
        />
      </Modal >
    </>
  )
}

export default PlaylistSortVideosModal
