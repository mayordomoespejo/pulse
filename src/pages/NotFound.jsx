import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ArrowLongIcon, ArrowShortIcon } from '../assets/icons/icons'
import Button from '../components/ui/Button'
import useBreakpoint from '../hooks/useBreakpoint'
import { ROUTES_NAMES } from '../router/routesNames'

/**
 * Página 404 - Página no encontrada
 * Muestra un mensaje amigable cuando el usuario accede a una ruta que no existe
 * 
 * @returns {JSX.Element}
 */

function NotFound() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isPhone } = useBreakpoint()
  const NOT_FOUND = t('NOT_FOUND', { returnObjects: true })

  const handleBackToHome = () => {
    navigate(ROUTES_NAMES.ROOT)
  }

  return (
    <div className="not-found">
      <div className="not-found__container">
        <div className="not-found__content">
          <div className="not-found__number">
            {NOT_FOUND.NUMBER}
          </div>

          <h1 className="not-found__title">
            {NOT_FOUND.TITLE}
          </h1>

          <div className="not-found__description-container">
            <div>
              {isPhone
                ? <ArrowShortIcon width="auto" height="100px" fill="currentColor" />
                : <ArrowLongIcon width="100px" height="auto" fill="currentColor" />
              }
            </div >
            <p>
              {NOT_FOUND.DESCRIPTION}
            </p>
          </div >

          <div className="not-found__actions">
            <Button
              label={t('CONSTANTS.BACK_TO_HOME')}
              onClick={handleBackToHome}
              variant="secondary"
            />
          </div>
        </div >
      </div >
    </div >
  )
}

export default NotFound
