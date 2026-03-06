import { useTranslation } from 'react-i18next'

import { BinIcon, EditIcon, EditListIcon, SortIcon } from '../../assets/icons/icons'
import usePlaylistModalStore from '../../stores/playlistModalStore'
import Toolbar from '../ui/Toolbar'

function PlaylistActionsBar({ playlist }) {
  const { t } = useTranslation()
  const PLAYLIST_ACTIONS_BAR = t('PLAYLIST_ACTIONS_BAR', { returnObjects: true })
  const {
    setIsOpenPlaylistAddVideos,
    setIsOpenPlaylistForm,
    setIsOpenPlaylistSortVideos,
    setIsOpenPlaylistRemove,
    setSelectedPlaylist,
  } = usePlaylistModalStore()

  const handleOpenAddVideos = (playlist) => {
    setIsOpenPlaylistAddVideos(true)
    setSelectedPlaylist(playlist)
  }

  const handleOpenFormModal = (playlist) => {
    setIsOpenPlaylistForm(true)
    setSelectedPlaylist(playlist)
  }

  const handleOpenSortVideos = (playlist) => {
    setIsOpenPlaylistSortVideos(true)
    setSelectedPlaylist(playlist)
  }

  const handleOpenRemovePlaylist = (playlist) => {
    setIsOpenPlaylistRemove(true)
    setSelectedPlaylist(playlist)
  }

  const actions = [
    { label: PLAYLIST_ACTIONS_BAR?.ADD_VIDEOS, onClick: () => handleOpenAddVideos(playlist), icon: <EditListIcon width={28} height={28} /> },
    { label: PLAYLIST_ACTIONS_BAR?.EDIT, onClick: () => handleOpenFormModal(playlist), icon: <EditIcon /> },
    { label: PLAYLIST_ACTIONS_BAR?.SORT, onClick: () => handleOpenSortVideos(playlist), icon: <SortIcon width={28} height={28} /> },
    { label: PLAYLIST_ACTIONS_BAR?.DELETE, onClick: () => handleOpenRemovePlaylist(playlist), icon: <BinIcon /> },
  ]

  return (
    <Toolbar actions={actions} />
  )
}

export default PlaylistActionsBar