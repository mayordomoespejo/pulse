import { isValid, format } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatDate(timestamp, dateFormat = 'dd/MM/yyyy', currentLocale = es) {
  const timestampInSeconds = timestamp * 1000
  return isValid(new Date(timestampInSeconds))
    ? format(new Date(timestampInSeconds), dateFormat, {
      locale: currentLocale,
    })
    : ''
}

const today = new Date()
today.setHours(today.getHours() + 3, 0, 0, 0)
export const timestampToday = today.getTime()