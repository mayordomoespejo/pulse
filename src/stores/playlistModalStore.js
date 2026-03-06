import { create } from 'zustand'

const initialState = {
  isOpenPlaylistForm: false, // Modal para crear/ editar una playlist
  isOpenPlaylistAddVideos: false, // Modal para añadir vídeos a una playlist
  isOpenPlaylistSortVideos: false, // Modal para ordenar vídeos en una playlist
  isOpenPlaylistRemove: false, // Modal para eliminar una playlist
  selectedPlaylist: null, // Playlist seleccionada para editar/añadir vídeos
}

const closeAll = (set) => set({
  isOpenPlaylistForm: false,
  isOpenPlaylistAddVideos: false,
  isOpenPlaylistSortVideos: false,
  isOpenPlaylistRemove: false,
  selectedPlaylist: null,
})

export const usePlaylistModalStore = create((set) => ({
  ...initialState,
  setIsOpenPlaylistForm: (value) => {
    closeAll(set)
    set({ isOpenPlaylistForm: value })
  },
  setIsOpenPlaylistAddVideos: (value, playlist) => {
    closeAll(set)
    set({ isOpenPlaylistAddVideos: value, selectedPlaylist: playlist })
  },
  setIsOpenPlaylistSortVideos: (value) => {
    closeAll(set)
    set({ isOpenPlaylistSortVideos: value })
  },
  setIsOpenPlaylistRemove: (value) => {
    closeAll(set)
    set({ isOpenPlaylistRemove: value })
  },
  setSelectedPlaylist: (playlist) => {
    set({ selectedPlaylist: playlist })
  },
  setIsOpenVideoForm: (value) => {
    closeAll(set)
    set({ isOpenVideoForm: value })
  },
  closeAll: () => closeAll(set),
}))

export default usePlaylistModalStore

