import PlaylistAddVideosModal from './PlaylistAddVideosModal'
import PlaylistFormModal from './PlaylistFormModal'
import PlaylistRemoveModal from './PlaylistRemoveModal'
import PlaylistSortVideosModal from './PlaylistSortVideosModal'

function PlaylistModalsWrapper() {
  return (
    <>
      <PlaylistFormModal />
      <PlaylistAddVideosModal />
      <PlaylistSortVideosModal />
      <PlaylistRemoveModal />
    </>
  )
}

export default PlaylistModalsWrapper