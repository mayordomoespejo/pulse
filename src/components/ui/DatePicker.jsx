import { es, fr, enUS } from 'date-fns/locale'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'
import { useTranslation } from 'react-i18next'

function DatePicker({
  hideNavigation = false,
  captionLayout = 'label',
  mode = 'multiple',
  selected,
  month,
  onMonthChange,
  onSelect,
  classNames,
  className,
  ...props
}) {

  const defaultClassNames = getDefaultClassNames()
  const { i18n } = useTranslation()
  const locales = { es, fr, en: enUS }
  const currentLocale = locales[i18n.language] || enUS

  return (
    <DayPicker
      hideNavigation={hideNavigation}
      captionLayout={captionLayout}
      locale={currentLocale}
      mode={mode}
      month={month}
      selected={selected}
      onMonthChange={onMonthChange}
      onSelect={onSelect}
      className={className}
      classNames={{
        root: `${defaultClassNames.root} rdp-root`,
        day: 'custom-day',
        ...classNames,
      }}
      {...props}
    />
  )
}

export default DatePicker