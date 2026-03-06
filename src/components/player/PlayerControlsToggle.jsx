import { EyeIcon } from '../../assets/icons/icons'
import useFullscreen from '../../hooks/useFullscreen'

import PlayerIconWrapper from './PlayerIconWrapper'

function PlayerControlsToggle({ showControlsInFullscreen, setShowControlsInFullscreen }) {
  const mediaIsFullscreen = useFullscreen()
  if (!mediaIsFullscreen) return null

  const onToggle = () => setShowControlsInFullscreen(!showControlsInFullscreen)

  return (
    <div className={`player-controls-toggle ${!showControlsInFullscreen ? 'player-controls-toggle--fullscreen' : ''}`}>
      <PlayerIconWrapper
        Component={EyeIcon}
        onClick={onToggle}
        isCloseEye={!showControlsInFullscreen}
      />
    </div>
  )
}

export default PlayerControlsToggle


