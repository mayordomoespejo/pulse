import { MediaMuteButton } from 'media-chrome/react'

import { VolumeIcon } from '../../assets/icons/icons'

import PlayerIconWrapper from './PlayerIconWrapper'

/**
 * media-chrome mute/unmute button with volume level icon slots.
 *
 * @param {Object} props
 * @param {boolean} [props.disabled=false]
 * @returns {JSX.Element}
 */
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
