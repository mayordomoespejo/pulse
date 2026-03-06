import { format, isEqual } from 'date-fns'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { ArrowAngleIcon, CrossCircleIcon } from '../../assets/icons/icons'
import { defaultStaticRanges } from '../../helpers/staticRanges'

import DatePicker from './DatePicker'
import Input from './Input'

function SelectDateRange({ useParams = true, onSelectDate = null, rangeDateValues = '' }) {
  const { t } = useTranslation()
  const staticRanges = defaultStaticRanges(t)
  const [rangeDate, setRangeDate] = useState(rangeDateValues)
  const [openCalendar, setOpenCalendar] = useState(false)
  const calendarRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (!openCalendar) return
    const handleClickOutside = (e) => calendarRef.current?.contains(e.target) || setOpenCalendar(false)

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openCalendar])

  const handleSelectDate = (range) => {
    // Si no hay rango o las fechas son null, limpiar la selección
    if (!range || (!range.from && !range.to)) {
      handleClear()
      return
    }

    const { from: startDate, to: endDate } = range
    const selectedRange = staticRanges?.find((range) => range?.isSelected(startDate, endDate) ? range : null)


    const formattedDate = isEqual(startDate, endDate)
      ? `${format(endDate, 'dd/MM/yyyy')}`
      : `${format(startDate, 'dd/MM/yy')} - ${format(endDate, 'dd/MM/yy')}`

    setRangeDate({ ...range, label: selectedRange?.label ? selectedRange?.label : formattedDate })

    if (useParams) {
      const start = startDate ? format(startDate, 'yyyy-MM-dd') : null
      const end = endDate ? format(endDate, 'yyyy-MM-dd') : null

      if (start) {
        searchParams.set('date-start', start)
        searchParams.set('date-end', end || start)
      } else {
        searchParams.delete('date-start')
        searchParams.delete('date-end')
      }

      setSearchParams(searchParams)
    }

    if (onSelectDate && !useParams) {
      onSelectDate(range)
    }
  }

  const handleClear = () => {
    setRangeDate({})
    if (useParams) {
      ['date-start', 'date-end'].forEach(param => searchParams.delete(param))
      setSearchParams(searchParams)
    }

    if (onSelectDate) {
      onSelectDate({})
    }
  }

  const handleClearClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    handleClear()
  }

  return (
    <>
      <div className="select-date-range" ref={calendarRef}>
        <button
          className="select-date-range__select"
          type="button"
          onClick={() => setOpenCalendar(!openCalendar)}
        >
          <Input
            value={rangeDate?.label || ''}
            placeholder={t('SELECT_DATE_RANGE.PLACEHOLDER')}
            useFormik={false}
            readOnly={true}
            IconAfter={
              <div className="select-date-range__icon-after">
                {rangeDate?.label && <CrossCircleIcon stroke="currentColor" onClick={handleClearClick} />}
                <ArrowAngleIcon
                  className={`select-date-range__arrow ${openCalendar ? 'select-date-range__arrow--open' : ''}`}
                  stroke="#currentColor"
                  direction="down"
                  useCssRotation={true}
                />
              </div>
            }
          />
        </button>
        {openCalendar && (
          <div className="select-date-range__container">
            <div className="select-date-range__ranges">
              {staticRanges.map((range, index) => (
                <button key={index}
                  className="select-date-range__range-item"
                  onClick={() => handleSelectDate(range)}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <DatePicker
              className="select-date-range__date-picker"
              mode="range"
              onSelect={handleSelectDate}
              selected={rangeDate}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default SelectDateRange
