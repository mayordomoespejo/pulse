import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  getDefaultPexelsLocale,
  PEXELS_VIDEO_LOCALES,
  PEXELS_VIDEO_ORIENTATIONS,
  PEXELS_VIDEO_SIZES,
} from '../../constants/pexelsFilters'
import Button from '../ui/Button.jsx'
import Modal from '../ui/Modal.jsx'
import SelectInput from '../ui/SelectInput.jsx'

/**
 * MediaSearchModal - Modal de filtros de búsqueda de media
 *
 * @param {Function} props.onClose  - Función para cerrar el modal
 * @param {Function} props.onSearch - Callback con los filtros: { orientation?, size?, locale? }
 * @param {Object}   [props.initialValues] - Valores iniciales de los filtros
 */
function MediaSearchModal({ onClose, onSearch, initialValues = {} }) {
  const { t, i18n } = useTranslation()
  const MEDIA_SEARCH = t('MEDIA_SEARCH', { returnObjects: true })
  const defaultLocale = getDefaultPexelsLocale(i18n.resolvedLanguage || i18n.language)
  const localeDisplayNames = useMemo(
    () => new Intl.DisplayNames([i18n.language], { type: 'language' }),
    [i18n.language]
  )
  const localeOptions = useMemo(
    () => PEXELS_VIDEO_LOCALES.map((value) => {
      const languageCode = value.split('-')[0]
      const languageName = localeDisplayNames.of(languageCode) || value
      const capitalizedLanguageName = languageName.charAt(0).toUpperCase() + languageName.slice(1)

      return {
        value,
        label: capitalizedLanguageName,
      }
    }),
    [localeDisplayNames]
  )

  const [orientation, setOrientation] = useState(initialValues.orientation ?? null)
  const [size, setSize] = useState(initialValues.size ?? null)
  const [localeValue, setLocaleValue] = useState(initialValues.locale ?? defaultLocale)
  const selectedLocaleOption = localeOptions.find((o) => o.value === localeValue) ?? null

  const handleClear = () => {
    setOrientation(null)
    setSize(null)
    setLocaleValue(defaultLocale)
  }

  const handleToggle = (setter, current, value) => {
    setter(current === value ? null : value)
  }

  const handleSubmit = () => {
    onSearch({
      ...(orientation && { orientation }),
      ...(size && { size }),
      ...(localeValue && { locale: localeValue }),
    })
    onClose()
  }

  return (
    <Modal
      title={MEDIA_SEARCH.TITLE}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={handleClear}>
            {MEDIA_SEARCH.CLEAR}
          </Button>
          <Button variant="secondary-inverse" onClick={handleSubmit}>
            {t('CONSTANTS.CONFIRM')}
          </Button>
        </>
      }
      actionsAlignment="space-between"
    >
      <div className="media-search">
        <div className="media-search__group">
          <span className="media-search__group-label">{MEDIA_SEARCH.ORIENTATION}</span>
          <div className="media-search__options">
            {PEXELS_VIDEO_ORIENTATIONS.map((value) => (
              <button
                key={value}
                type="button"
                className={`media-search__option ${orientation === value ? 'media-search__option--selected' : ''}`}
                onClick={() => handleToggle(setOrientation, orientation, value)}
                aria-pressed={orientation === value}
              >
                <div className="media-search__shape-wrapper">
                  <div className={`media-search__shape media-search__shape--${value}`} />
                </div>
                <span>{MEDIA_SEARCH[value.toUpperCase()]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="media-search__group">
          <span className="media-search__group-label">{MEDIA_SEARCH.SIZE}</span>
          <div className="media-search__options">
            {PEXELS_VIDEO_SIZES.map((value) => (
              <button
                key={value}
                type="button"
                className={`media-search__option ${size === value ? 'media-search__option--selected' : ''}`}
                onClick={() => handleToggle(setSize, size, value)}
                aria-pressed={size === value}
              >
                <div className="media-search__shape-wrapper">
                  <div className={`media-search__shape media-search__shape--${value}`} />
                </div>
                <span>{MEDIA_SEARCH[value.toUpperCase()]}</span>
              </button>
            ))}
          </div>
        </div>

        <SelectInput
          useFormik={false}
          name="locale"
          label={MEDIA_SEARCH.LOCALE}
          options={localeOptions}
          placeholder={MEDIA_SEARCH.LOCALE_PLACEHOLDER}
          typeStyled="secondary"
          value={selectedLocaleOption}
          onChange={(opt) => setLocaleValue(opt?.value ?? '')}
          isClearable
        />
      </div>
    </Modal>
  )
}

export default MediaSearchModal
