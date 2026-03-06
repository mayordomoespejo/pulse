import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { MagnifyingGlassIcon } from '../../assets/icons/icons'

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

  useEffect(() => {
    if (!useParams) {
      setInputValue(value ?? '')
    }
  }, [useParams, value])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (useParams) {
        if (inputValue) {
          searchParams.set(paramName, inputValue)
        } else {
          searchParams.delete(paramName)
        }
        setSearchParams(searchParams)
      } else {
        onChange?.(inputValue)
      }
    }, debounceMs)

    return () => clearTimeout(timeout)
  }, [inputValue, useParams, paramName, searchParams, setSearchParams, onChange, debounceMs])

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
