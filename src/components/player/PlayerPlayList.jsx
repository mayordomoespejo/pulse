import { useTranslation } from 'react-i18next'

import useVideoStore from '../../stores/videoStore'

import PlayerCardPlayList from './PlayerCardPlayList'

/**
 * Scrollable sidebar playlist showing all items in the current playlist.
 * Highlights the active item and delegates playback selection to the store.
 *
 * @returns {JSX.Element}
 */
function PlayerPlaylist() {
  const { t } = useTranslation()
  const { currentPlaylist, currentVideo, setCurrentVideo } = useVideoStore()

  const playlistItems = currentPlaylist?.playlistItems || []
  const currentIndex = playlistItems.findIndex(({ video }) => video?.id === currentVideo?.video?.id)

  return (
    <div className="player-playlist">
      {!Array.isArray(playlistItems) || playlistItems?.length === 0
        ? <div></div>
        : <>
          <h3 className="player-playlist__title">{t('PLAYER_PLAYLIST.TITLE')}</h3>
          <ul className="player-playlist__list">
            {playlistItems.map((playlistItem, index) =>
              <PlayerCardPlayList
                key={`${playlistItem.url}-${index}`}
                playlistItem={playlistItem}
                setCurrentVideo={setCurrentVideo}
                isActive={currentIndex === index}
              />)}
          </ul>
        </>
      }
    </div>
  )
}

export default PlayerPlaylist
