import { MediaPlayButton } from 'media-chrome/react'

import { PauseCircleIcon, PauseIcon, PlayCircleIcon, PlayIcon } from '../../assets/icons/icons'
import { PLAYER_CIRCLE_ICON_STYLE } from '../../constants/constants'

import PlayerIconWrapper from './PlayerIconWrapper'

/**
 * media-chrome play/pause button with circle or bar icon variants.
 *
 * @param {Object} props
 * @param {boolean} [props.isCircle=false] - Uses large circle icons when true.
 * @returns {JSX.Element}
 */
function PlayerPlayPause({ isCircle = false, }) {

  const PlayIconComponent = isCircle
    ? <PlayerIconWrapper Component={PlayCircleIcon} isCircle className="player-play-pause" {...PLAYER_CIRCLE_ICON_STYLE} />
    : <PlayerIconWrapper Component={PlayIcon} className="player-play-pause" />

  const PauseIconComponent = isCircle
    ? <PlayerIconWrapper Component={PauseCircleIcon} isCircle className="player-play-pause" {...PLAYER_CIRCLE_ICON_STYLE} />
    : <PlayerIconWrapper Component={PauseIcon} className="player-play-pause" />

  return (
    <MediaPlayButton noTooltip>
      <div slot="play" className="player-play-pause">
        {PlayIconComponent}
      </div>
      <div slot="pause" className="player-play-pause">
        {PauseIconComponent}
      </div>
    </MediaPlayButton>
  )
}

export default PlayerPlayPause
