import { create } from 'zustand'

const initialState = {
  isOpenVideoForm: false, // Modal para crear/ editar un vídeo
}

const closeAll = (set) => set({
  isOpenVideoForm: false,
})

export const useVideoModalStore = create((set) => ({
  ...initialState,
  setIsOpenVideoForm: (value) => {
    closeAll(set)
    set({ isOpenVideoForm: value })
  },
  closeAll: () => closeAll(set),
}))

export default useVideoModalStore

