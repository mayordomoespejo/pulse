import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Trans, useTranslation } from 'react-i18next'

import { deletePlaylist } from '../../services/playlists/deletePlaylist'
import usePlaylistModalStore from '../../stores/playlistModalStore'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

/**
 * RemoveModal - Modal de confirmación para eliminar un vídeo
 *
 * @param {Object}   props
 * @param {string}   props.title       Título del vídeo a eliminar
 * @param {Function} props.onCancel    Función que se llama al cancelar
 * @param {Function} props.onConfirm   Función que se llama al confirmar
 * @param {boolean}  props.isDeleting  Si se está procesando la eliminación
 */

function PlaylistRemoveModal() {
  const { t } = useTranslation()
  const PLAYLIST_REMOVE_MODAL = t('PLAYLIST_REMOVE_MODAL', { returnObjects: true })
  const CONSTANTS = t('CONSTANTS', { returnObjects: true })

  const queryClient = useQueryClient()

  const {
    selectedPlaylist,
    isOpenPlaylistRemove,
    setIsOpenPlaylistRemove,
    setSelectedPlaylist,
  } = usePlaylistModalStore()

  const { mutate: mutateDeletePlaylist, isPending: isPendingDelete } = useMutation({
    mutationFn: (id) => deletePlaylist(id),
    onSuccess: () => {
      setIsOpenPlaylistRemove(false)
      setSelectedPlaylist(null)
    },
  })

  const onCancel = () => {
    setIsOpenPlaylistRemove(false)
    setSelectedPlaylist(null)
  }

  const onConfirm = () => {
    const playlistsIds = [selectedPlaylist?.id]
    mutateDeletePlaylist(playlistsIds, {
      onSuccess: () => {
        toast.success(PLAYLIST_REMOVE_MODAL.TOAST.DELETE_SUCCESS)
        queryClient.invalidateQueries({ queryKey: ['playlists'] })
        setIsOpenPlaylistRemove(false)
        setSelectedPlaylist(null)
      },
      onError: () => {
        toast.error(PLAYLIST_REMOVE_MODAL.TOAST.DELETE_ERROR)
      },
    })
  }

  if (!isOpenPlaylistRemove) return null

  return (
    <Modal
      title={PLAYLIST_REMOVE_MODAL.TITLE}
      onClose={onCancel}
      actions={
        <>
          <Button
            onClick={onCancel}
            label={CONSTANTS.CANCEL}
            theme="secondary"
            size="medium"
          />
          <Button
            onClick={() => onConfirm(selectedPlaylist?.id)}
            label={CONSTANTS.DELETE}
            theme="remove"
            size="medium"
            disabled={isPendingDelete}
          />
        </>
      }
    >
      <div className="remove-modal__content">
        <p>
          <Trans
            i18nKey="PLAYLIST_REMOVE_MODAL.BODY.LINE_1"
            values={{ title: selectedPlaylist?.name }}
            components={{ 1: <b /> }}
          />
        </p>
        <p>{PLAYLIST_REMOVE_MODAL.BODY.LINE_2}</p>
      </div>
    </Modal>
  )
}

export default PlaylistRemoveModal
