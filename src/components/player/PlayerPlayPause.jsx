import { MediaPlayButton } from 'media-chrome/react'

import { PauseCircleIcon, PauseIcon, PlayCircleIcon, PlayIcon } from '../../assets/icons/icons'

import PlayerIconWrapper from './PlayerIconWrapper'

function PlayerPlayPause({ isCircle = false, }) {

  const PlayIconComponent = isCircle
    ? <PlayerIconWrapper Component={PlayCircleIcon} isCircle className="player-play-pause" stroke="#FFFFFF" colorIcon="#FFFFFF" bg="rgba(0, 0, 0, 0.4)" />
    : <PlayerIconWrapper Component={PlayIcon} className="player-play-pause" />

  const PauseIconComponent = isCircle
    ? <PlayerIconWrapper Component={PauseCircleIcon} isCircle className="player-play-pause" stroke="#FFFFFF" colorIcon="#FFFFFF" bg="rgba(0, 0, 0, 0.4)" />
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
