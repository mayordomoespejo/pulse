import { MediaFullscreenButton } from 'media-chrome/react'

import { ExpandScreenIcon, FullScreenIcon } from '../../assets/icons/icons'

import PlayerIconWrapper from './PlayerIconWrapper'

function PlayerFullscreen() {
  return (
    <MediaFullscreenButton className="player-fullscreen" >
      <span slot="enter">
        <PlayerIconWrapper Component={ExpandScreenIcon} />
      </span>
      <span slot="exit">
        <PlayerIconWrapper Component={FullScreenIcon} />
      </span>
    </MediaFullscreenButton>
  )
}

export default PlayerFullscreen