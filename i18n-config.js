import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from './src/translations/en.json'
import es from './src/translations/es.json'

const SUPPORTED_LANGUAGES = ['en', 'es']
const STORAGE_KEY = 'pulse_language'

const getBrowserLanguage = () => {
  if (typeof navigator === 'undefined') return 'es'
  const browserLanguage = navigator.language?.toLowerCase().split('-')[0]
  return SUPPORTED_LANGUAGES.includes(browserLanguage) ? browserLanguage : 'es'
}

const getInitialLanguage = () => {
  if (typeof window === 'undefined') return getBrowserLanguage()

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY)
  if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
    return storedLanguage
  }

  return getBrowserLanguage()
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'es',
  interpolation: { escapeValue: false },
})

i18n.on('languageChanged', (lng) => {
  if (typeof window === 'undefined') return
  const language = lng?.toLowerCase().split('-')[0]
  if (!SUPPORTED_LANGUAGES.includes(language)) return
  window.localStorage.setItem(STORAGE_KEY, language)
})

export default i18n
