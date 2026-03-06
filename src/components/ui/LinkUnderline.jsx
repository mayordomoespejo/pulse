import { useTranslation } from 'react-i18next'
import { NavLink, } from 'react-router-dom'

import { ArrowAngleIcon } from '../../assets/icons/icons'

function LinkUnderline({
  text,
  className,
  color = '#000',
  href = -1,
  IconBefore = ArrowAngleIcon,
}) {
  const { t } = useTranslation()
  const textLabel = text || t('LINK_UNDERLINE.BACK')

  return (
    <div className={`link-underline ${className}`}>
      {IconBefore && <IconBefore />}
      <NavLink
        to={href}
        style={{ '--link-color': color }}
        className={'link-underline__link'}
      >
        {textLabel}
      </NavLink>
    </div>
  )
}

export default LinkUnderline
