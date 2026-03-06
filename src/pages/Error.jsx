import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { ArrowLongIcon, ArrowShortIcon } from '../assets/icons/icons'
import Button from '../components/ui/Button'
import useBreakpoint from '../hooks/useBreakpoint'
import { ROUTES_NAMES } from '../router/routesNames'

/**
 * Generic error boundary fallback page.
 * Displays an error title, description, and a button to return to the home route.
 *
 * @returns {JSX.Element}
 */
function Error() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isPhone } = useBreakpoint()
  const ERROR = t('ERROR', { returnObjects: true })

  const handleBackToHome = () => {
    navigate(ROUTES_NAMES.ROOT)
  }

  return (
    <div className="error-page">
      <div className="error-page__container">
        <div className="error-page__content">
          <h1 className="error-page__title">
            {ERROR.TITLE}
          </h1>

          <div className="error-page__description-container">
            <div>
              {isPhone
                ? <ArrowShortIcon height="50px" fill="currentColor" />
                : <ArrowLongIcon width="100px" fill="currentColor" />
              }
            </div >
            <p>
              {ERROR.MESSAGE}
            </p>
          </div >

          <div className="error-page__actions">
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

export default Error
