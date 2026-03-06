export const PEXELS_VIDEO_ORIENTATIONS = [
  'landscape',
  'portrait',
  'square',
]

export const PEXELS_VIDEO_SIZES = [
  'large',
  'medium',
  'small',
]

export const PEXELS_VIDEO_LOCALES = [
  'en-US',
  'pt-BR',
  'es-ES',
  'ca-ES',
  'de-DE',
  'it-IT',
  'fr-FR',
  'sv-SE',
  'id-ID',
  'pl-PL',
  'ja-JP',
  'zh-TW',
  'zh-CN',
  'ko-KR',
  'th-TH',
  'nl-NL',
  'hu-HU',
  'vi-VN',
  'cs-CZ',
  'da-DK',
  'fi-FI',
  'uk-UA',
  'el-GR',
  'ro-RO',
  'nb-NO',
  'sk-SK',
  'tr-TR',
  'ru-RU',
]

export const PEXELS_DEFAULT_LOCALE_BY_LANGUAGE = {
  es: 'es-ES',
  en: 'en-US',
}

export const getDefaultPexelsLocale = (language = 'es') => {
  const shortLanguage = language.toLowerCase().split('-')[0]
  return PEXELS_DEFAULT_LOCALE_BY_LANGUAGE[shortLanguage] || PEXELS_DEFAULT_LOCALE_BY_LANGUAGE.es
}
