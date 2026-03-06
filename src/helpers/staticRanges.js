import { startOfWeek, endOfWeek, addDays, startOfDay, endOfDay, isSameDay } from 'date-fns'


export const dateRanges = {
  startOfToday: startOfDay(new Date()),
  endOfToday: endOfDay(new Date()),
  startOfTomorrow: startOfDay(addDays(new Date(), 1)),
  endOfTomorrow: endOfDay(addDays(new Date(), 1)),
  startOfWeek: startOfWeek(new Date(), { weekStartsOn: 1 }),
  endOfWeek: endOfWeek(new Date(), { weekStartsOn: 1 })
}

const staticRangeHandler = {
  from: null,
  to: null,
  label: '',
  isSelected(from, to) {
    const definedRange = this
    return (
      isSameDay(from, definedRange.from) &&
      isSameDay(to, definedRange.to)
    )
  },
}

export function createStaticRanges(ranges) {
  return ranges.map(range => ({ ...staticRangeHandler, ...range }))
}

export const defaultStaticRanges = (t) => {
  return createStaticRanges([
    {
      label: t('CONSTANTS.TODAY'),
      from: dateRanges.startOfToday,
      to: dateRanges.endOfToday,
    },
    {
      label: t('CONSTANTS.TOMORROW'),
      from: dateRanges.startOfTomorrow,
      to: dateRanges.endOfTomorrow,
    },
    {
      label: t('CONSTANTS.THIS_WEEK'),
      from: dateRanges.startOfWeek,
      to: dateRanges.endOfWeek,
    }
  ])
}
