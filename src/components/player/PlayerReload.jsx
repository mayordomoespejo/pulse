import { ReloadIcon } from '../../assets/icons/icons'

import PlayerIconWrapper from './PlayerIconWrapper'


function PlayerReload({
  slot = '',
  className = '',
  isCircle = false,
  onClick = null,
  sizeCircle = 'large',
}) {

  const reloadIcon = isCircle
    ? <PlayerIconWrapper Component={ReloadIcon} isCircle sizeCircle={sizeCircle} stroke="#FFFFFF" colorIcon="#FFFFFF" bg="rgba(0, 0, 0, 0.4)" />
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
