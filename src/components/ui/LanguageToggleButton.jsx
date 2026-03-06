import { useTranslation } from 'react-i18next'

import Button from './Button'

const SUPPORTED_LANGUAGES = ['es', 'en']

function normalizeLanguage(code) {
  if (!code) return 'es'
  const shortCode = code.toLowerCase().split('-')[0]
  return SUPPORTED_LANGUAGES.includes(shortCode) ? shortCode : 'es'
}

function LanguageToggleButton({ className = '' }) {
  const { i18n, t } = useTranslation()
  const currentLanguage = normalizeLanguage(i18n.resolvedLanguage || i18n.language)
  const nextLanguage = currentLanguage === 'es' ? 'en' : 'es'

  const handleToggleLanguage = () => {
    i18n.changeLanguage(nextLanguage)
  }

  return (
    <Button
      type="button"
      theme="tertiary"
      size="medium"
      className={`language-toggle-button ${className}`}
      onClick={handleToggleLanguage}
      aria-label={t('LANGUAGE_SWITCH.ARIA', { lang: nextLanguage.toUpperCase() })}
      title={t('LANGUAGE_SWITCH.TITLE')}
    >
      {nextLanguage.toUpperCase()}
    </Button>
  )
}

export default LanguageToggleButton
