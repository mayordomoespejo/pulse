import { EyeIcon } from '../../assets/icons/icons'
import useFullscreen from '../../hooks/useFullscreen'

import PlayerIconWrapper from './PlayerIconWrapper'

/**
 * Eye toggle button that shows/hides player controls in fullscreen mode.
 * Renders nothing when not in fullscreen.
 *
 * @param {Object} props
 * @param {boolean} props.showControlsInFullscreen
 * @param {Function} props.setShowControlsInFullscreen
 * @returns {JSX.Element|null}
 */
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
