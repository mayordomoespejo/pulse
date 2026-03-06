import { useTranslation } from 'react-i18next'

/**
 * EmptyState - Muestra un mensaje cuando una lista está vacía
 *
 * @param {string} message Mensaje a mostrar
 * @param {string} className Clase CSS adicional opcional
 * @returns {JSX.Element}
 */

function EmptyState({
  text,
  className = '',
  textColor = 'tertiary',
}) {
  const { t } = useTranslation()
  const normalizedText = text || t('EMPTY_STATE.DEFAULT')

  return (
    <p
      className={`empty-state ${className}`}
      style={{ '--empty-state-text-color': `var(--color-${textColor})` }}
    >
      {normalizedText}
    </p>
  )
}

export default EmptyState
