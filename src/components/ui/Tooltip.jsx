'use client'

import { isValidElement } from 'react'
import { Trans } from 'react-i18next'

/**
 * Tooltip personalizado con soporte para contenido textual o JSX.
 *
 * - JSX → render directo
 * - String con HTML → <Trans>
 * - String plano → ::after con data-tooltip
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elemento que activa el tooltip. Por defecto se muestra un `?`.
 * @param {React.ReactNode|string} props.content - Contenido del tooltip.
 * @param {'top'|'bottom'|'left'|'right'|'top-left'} [props.position='top'] - Posición del tooltip.
 * @param {string} [props.className] - Clases personalizadas.
 * @param {boolean} [props.noRelative=false] - Si evita position: relative.
 */

function Tooltip({
  children,
  content,
  position = 'bottom',
  className = '',
  noRelative = false,
}) {
  const tooltipClass = `tooltip tooltip-${position} ${noRelative && 'tooltip--no-relative'}`
  const trigger = children || <span className="tooltip__default-trigger">?</span>
  const hasHTMLTags = typeof content === 'string' && /<\s*\/?\s*\w+[^>]*>/.test(content)

  // JSX (caso 1)
  if (isValidElement(content)) {
    return (
      <span className={`${tooltipClass} tooltip--custom ${className}`}>
        <span className="tooltip__custom-content">
          {content}
        </span>
        {trigger}
      </span>
    )
  }

  // String con HTML (caso 2)
  if (hasHTMLTags) {
    return (
      <span className={`${tooltipClass} tooltip--custom ${className}`}>
        <span className="tooltip__custom-content tooltip__custom-content--html">
          <Trans
            components={{ b: <strong className="tooltip__bold" /> }}
          >
            {content}
          </Trans>
        </span>
        {trigger}
      </span>
    )
  }

  // Texto plano (caso 3)
  return (
    <span
      className={`${tooltipClass} ${className}`}
      data-tooltip={content}
      aria-hidden="true"
    >
      {trigger}
    </span>
  )
}

export default Tooltip
