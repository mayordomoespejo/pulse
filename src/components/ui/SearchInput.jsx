import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { MagnifyingGlassIcon } from '../../assets/icons/icons'

/**
 * Debounced search input that syncs to URL search params or calls a controlled callback.
 *
 * @param {Object} props
 * @param {string} [props.paramName='search'] - URL search param key (when `useParams` is true).
 * @param {string} [props.placeholder]
 * @param {string} [props.className]
 * @param {boolean} [props.useParams=true] - Syncs to URL params when true; calls `onChange` when false.
 * @param {string} [props.value] - Controlled value (only when `useParams` is false).
 * @param {Function} [props.onChange] - Called with the debounced value (only when `useParams` is false).
 * @param {number} [props.debounceMs=400] - Debounce delay in ms.
 * @param {'primary'|'secondary'} [props.variant='secondary'] - Visual style variant.
 * @param {boolean} [props.disabled=false]
 * @returns {JSX.Element}
 */
function SearchInput({
  paramName = 'search',
  placeholder,
  className = '',
  useParams = true,
  value,
  onChange,
  debounceMs = 400,
  variant = 'secondary',
  disabled = false,
}) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [inputValue, setInputValue] = useState(
    useParams ? (searchParams.get(paramName) || '') : (value ?? '')
  )
  const inputRef = useRef(null)

  // Keep mutable refs for values that shouldn't re-trigger the debounce timer.
  // `searchParams` is a new object on every render (React Router), and `onChange`
  // may be an inline function — putting either directly in the dep array would
  // reset the debounce on every keystroke render cycle.
  const searchParamsRef = useRef(searchParams)
  const setSearchParamsRef = useRef(setSearchParams)
  const onChangeRef = useRef(onChange)
  useEffect(() => { searchParamsRef.current = searchParams }, [searchParams])
  useEffect(() => { setSearchParamsRef.current = setSearchParams }, [setSearchParams])
  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    if (!useParams) {
      setInputValue(value ?? '')
    }
  }, [useParams, value])

  const commitValue = useCallback((val) => {
    if (useParams) {
      const next = new URLSearchParams(searchParamsRef.current)
      if (val) {
        next.set(paramName, val)
      } else {
        next.delete(paramName)
      }
      setSearchParamsRef.current(next)
    } else {
      onChangeRef.current?.(val)
    }
  }, [useParams, paramName])

  useEffect(() => {
    const timeout = setTimeout(() => {
      commitValue(inputValue)
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [inputValue, debounceMs, commitValue])

  const handleClickContainer = () => {
    if (!disabled) {
      inputRef.current?.focus()
    }
  }

  return (
    <div
      className={`search-input search-input--${variant} ${className}`.trim()}
      onClick={handleClickContainer}
    >
      <div className="search-input__input-wrapper" aria-disabled={disabled}>
        <MagnifyingGlassIcon className="search-input__icon" stroke="currentColor" />
        <input
          ref={inputRef}
          type="text"
          className="search-input__field"
          placeholder={placeholder || `${t('CONSTANTS.SEARCH')}...`}
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export default SearchInput
