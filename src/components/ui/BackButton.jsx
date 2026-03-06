import { NavLink } from 'react-router-dom'

import { ArrowShortIcon } from '../../assets/icons/icons'

/**
 * Back navigation button using react-router NavLink.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string|number} [props.to=-1] - Route path or history delta (-1 goes back).
 * @returns {JSX.Element}
 */
const BackButton = ({ className = '', to = -1 }) => {
  return (
    <NavLink
      className={`back-button ${className}`}
      to={to}
    >
      <ArrowShortIcon
        direction="left"
      />
    </NavLink>
  )
}

export default BackButton
