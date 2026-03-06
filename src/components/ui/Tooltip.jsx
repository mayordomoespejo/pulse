import { isValidElement } from 'react'
import { Trans } from 'react-i18next'

/**
 * Tooltip with support for JSX, HTML strings, and plain text content.
 *
 * - JSX → rendered directly inside the tooltip
 * - String with HTML tags → rendered via `<Trans>`
 * - Plain string → CSS `::after` via `data-tooltip`
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Trigger element. Defaults to a `?` span.
 * @param {React.ReactNode|string} props.content - Tooltip content.
 * @param {'top'|'bottom'|'left'|'right'|'top-left'} [props.position='bottom'] - Tooltip position.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {boolean} [props.noRelative=false] - Omits `position: relative` on the wrapper.
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
