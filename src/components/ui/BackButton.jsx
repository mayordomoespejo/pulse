import { NavLink } from 'react-router-dom'

import { ArrowShortIcon } from '../../assets/icons/icons'

const BackButton = ({ className = '', href = -1 }) => {
  return (
    <NavLink
      className={`back-button ${className}`}
      to={href}
    >
      <ArrowShortIcon
        direction="left"
      />
    </NavLink>
  )
}

export default BackButton
