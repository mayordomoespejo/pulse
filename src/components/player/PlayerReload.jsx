import { ReloadIcon } from '../../assets/icons/icons'
import { PLAYER_CIRCLE_ICON_STYLE } from '../../constants/constants'

import PlayerIconWrapper from './PlayerIconWrapper'


/**
 * Reload / restart button for the player.
 * Only renders an icon when `isCircle` is true; non-circle mode renders an empty button.
 *
 * @param {Object} props
 * @param {string} [props.slot] - media-chrome slot name.
 * @param {string} [props.className]
 * @param {boolean} [props.isCircle=false]
 * @param {Function|null} [props.onClick=null]
 * @param {'large'|'small'} [props.sizeCircle='large']
 * @returns {JSX.Element}
 */
function PlayerReload({
  slot = '',
  className = '',
  isCircle = false,
  onClick = null,
  sizeCircle = 'large',
}) {

  const reloadIcon = isCircle
    ? <PlayerIconWrapper Component={ReloadIcon} isCircle sizeCircle={sizeCircle} {...PLAYER_CIRCLE_ICON_STYLE} />
    : <></>

  return (
    <button
      className={`${className}`}
      slot={slot}
      onClick={onClick}
    >
      {reloadIcon}
    </button >
  )
}

export default PlayerReload
