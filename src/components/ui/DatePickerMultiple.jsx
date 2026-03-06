import { isValid } from 'date-fns'
import { useState, useEffect, useMemo } from 'react'
import { getDefaultClassNames } from 'react-day-picker'

import { formatDate } from '../../helpers/date'

import DatePicker from './DatePicker'

/**
 * DatePickerMultiple component que permite seleccionar múltiples fechas
 * @param {object} props - Props
 * @param {string} props.inputValue - String con las fechas seleccionadas separadas por comas (formato: 'yyyy-MM-dd, yyyy-MM-dd')
 * @param {function} props.setInputValue - Función para actualizar el valor de las fechas seleccionadas
 * @param {boolean} props.hideNavigation - Ocultar las flechas de navegación
 * @param {"label" | "dropdown" | "dropdown-months" | "dropdown-years"} props.captionLayout 
 *  - label: muestra mes y año como label
 *  - dropdown: muestra mes y año como dropdown
 *  - dropdown-months: muestra mes como dropdown y año como label
 *  - dropdown-years: muestra año como dropdown y mes como label
 * @param {string} props.defaultMonth - Mes por defecto para mostrar en el calendario (formato: 'yyyy-MM-dd')
 * @returns {JSX.Element} DatePicker component
 * 
 * @example
 * <DatePickerMultiple
 *   inputValue="2023-10-10, 2023-10-15, 2023-10-20"
 *   setInputValue={(dates) => handleDatesChange(dates)}
 *   hideNavigation={false}
 *   captionLayout="label"
 *   defaultMonth="2023-10-01"
 * />
 */

function DatePickerMultiple({
  inputValue,
  setInputValue,
  hideNavigation = false,
  captionLayout = 'label',
  defaultMonth = null,
  ...props
}) {

  const defaultClassNames = getDefaultClassNames()
  const formattedInputValue = useMemo(() => inputValue ? inputValue.map(schedule => new Date(schedule?.scheduledAt)) : [], [inputValue])
  const [selectedDates, setSelectedDates] = useState(formattedInputValue)
  const [displayDate, setDisplayDate] = useState(formattedInputValue ? formattedInputValue[0] : new Date())

  useEffect(() => {
    if (!inputValue || !Array.isArray(inputValue) || inputValue?.length === 0) {
      setSelectedDates([])
      return
    }

    const dates = formattedInputValue?.map(selectedDate => new Date(selectedDate))

    if (dates.every(isValid)) {
      setSelectedDates(dates)
      setDisplayDate(dates[0])
      return
    }
    setSelectedDates([])
  }, [formattedInputValue, inputValue])

  useEffect(() => {
    if (defaultMonth && isValid(new Date(defaultMonth))) {
      setDisplayDate(new Date(defaultMonth))
    }
  }, [defaultMonth])

  const handleDayPickerSelect = (dates) => {

    if (!dates || dates.length === 0) {
      setSelectedDates([])
      setInputValue([])
      return
    }

    const formattedDates = dates.map(date => new Date(date))
    setDisplayDate(new Date(dates[0]))
    setSelectedDates(formattedDates)
    setInputValue(formattedDates.map(date => formatDate(+date / 1000, 'yyyy-MM-dd')))
  }

  const handleOnChangeMonth = (month) => {
    setDisplayDate(month)
  }

  return (
    <DatePicker
      mode="multiple"
      selected={selectedDates}
      month={displayDate}
      onMonthChange={handleOnChangeMonth}
      onSelect={handleDayPickerSelect}
      hideNavigation={hideNavigation}
      captionLayout={captionLayout}
      defaultMonth={defaultMonth}
      className={'date-picker-multiple'}
      classNames={{
        ...defaultClassNames,
        selected: `${defaultClassNames.selected} date-picker-multiple__selected`,
      }}
      {...props}
    />
  )
}

export default DatePickerMultiple