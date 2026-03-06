import { BackwardCircleIcon, BackwardIcon, ForwardCircleIcon, ForwardIcon } from '../../assets/icons/icons'

import PlayerIconWrapper from './PlayerIconWrapper'

/**
 * Next or previous track button for the player.
 * Renders nothing when `isShow` is false.
 *
 * @param {Object} props
 * @param {Function} [props.onNextVideo]
 * @param {Function} [props.onPrevVideo]
 * @param {boolean} [props.isShow=true]
 * @param {boolean} [props.isDisabled=false]
 * @param {string} [props.slot] - media-chrome slot name.
 * @param {string} [props.className]
 * @param {boolean} [props.isCircle=false] - Uses circle icons when true.
 * @param {boolean} [props.isPrev=false] - Renders the previous button when true.
 * @returns {JSX.Element|null}
 */
const PlayerNextPrev = ({
  onNextVideo,
  onPrevVideo,
  isShow = true,
  isDisabled = false,
  slot = '',
  className = '',
  isCircle = false,
  isPrev = false
}) => {
  const nextIcon = isCircle
    ? <PlayerIconWrapper Component={ForwardCircleIcon} isCircle sizeCircle="small" />
    : <PlayerIconWrapper Component={ForwardIcon} />

  const prevIcon = isCircle
    ? <PlayerIconWrapper Component={BackwardCircleIcon} isCircle sizeCircle="small" />
    : <PlayerIconWrapper Component={BackwardIcon} />

  if (!isShow) return null

  return (
    <button
      slot={slot}
      className={className}
      onClick={isPrev ? onPrevVideo : onNextVideo}
      disabled={isDisabled}
      style={{
        opacity: isDisabled ? 0.5 : 1,
        cursor: isDisabled ? 'not-allowed' : 'pointer'
      }}
    >
      {isPrev ? prevIcon : nextIcon}
    </button>
  )
}

export default PlayerNextPrev
