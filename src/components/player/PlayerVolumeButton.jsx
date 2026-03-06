import { MediaMuteButton } from 'media-chrome/react'

import { VolumeIcon } from '../../assets/icons/icons'

import PlayerIconWrapper from './PlayerIconWrapper'

function PlayerVolumeButton({ disabled = false }) {
  const slots = ['high', 'medium', 'low', 'off']

  return (
    <MediaMuteButton noTooltip disabled={disabled} aria-disabled={disabled}>
      {slots.map(slot => (
        <PlayerIconWrapper Component={VolumeIcon} key={slot} slot={slot} />
      ))}
    </MediaMuteButton >
  )
}

export default PlayerVolumeButton
