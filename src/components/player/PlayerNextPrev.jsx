import { BackwardCircleIcon, BackwardIcon, ForwardCircleIcon, ForwardIcon } from '../../assets/icons/icons'

import PlayerIconWrapper from './PlayerIconWrapper'

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
