import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'

import { ArrowShortIcon } from '../../assets/icons/icons'

/**
 * @typedef {Object} PaginationProps
 * 
 * @property {string} className - Clases CSS adicionales
 * @property {boolean} useParams - Sincroniza la página con los parámetros de la URL
 * @property {number} controlledPage - Página actual en modo controlado
 * @property {Function} onChangePage - Callback para cambiar la página en modo controlado
 * @property {number} pagesCount - Total de páginas
 * @property {string} pageParam - Parámetro de la URL para la página
 * @returns {JSX.Element}
 */

function Pagination({
  className = '',
  useParams = true,
  controlledPage,
  onChangePage,
  pagesCount,
  pageParam = 'page',
}) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  const paramValue = +searchParams.get(pageParam) || 1
  const controlledValue = +controlledPage || 1
  const currentPage = useParams
    ? (Number.isFinite(paramValue) && paramValue > 0 ? paramValue : 1)
    : controlledValue


  const lastPage = Number.isFinite(pagesCount) ? Math.max(1, Number(pagesCount)) : 1
  const normalizedCurrentPage = Math.min(Math.max(1, currentPage), lastPage)

  const canGoPrevious = normalizedCurrentPage > 1
  const canGoNext = normalizedCurrentPage < lastPage

  const handleNavigateToPage = (nextPage) => {
    const normalized = Math.min(Math.max(1, nextPage), lastPage)
    if (!useParams) {
      onChangePage?.(normalized)
      return
    }

    const updatedSearchParams = new URLSearchParams(searchParams)
    if (normalized > 1) {
      updatedSearchParams.set(pageParam, String(normalized))
    }
    if (normalized <= 1) {
      updatedSearchParams.delete(pageParam)
    }
    setSearchParams(updatedSearchParams)
  }

  if (lastPage <= 1) return null

  return (
    <nav className={`pagination ${className}`} aria-label={t('PAGINATION.NAVIGATION')}>
      <div className="pagination__pages">
        <button
          className="pagination__btn"
          disabled={!canGoPrevious}
          onClick={() => handleNavigateToPage(normalizedCurrentPage - 1)}
          aria-label={t('PAGINATION.GO_TO_PREVIOUS')}
        >
          <ArrowShortIcon direction="left" width="14" height="14" />
        </button>
        <span
          className="pagination__label"
          aria-live="polite"
        >
          {`${String(normalizedCurrentPage).padStart(2, '0')} / ${String(lastPage).padStart(2, '0')}`}
        </span>
        <button
          className="pagination__btn"
          disabled={!canGoNext}
          onClick={() => handleNavigateToPage(normalizedCurrentPage + 1)}
          aria-label={t('PAGINATION.GO_TO_NEXT')}
        >
          <ArrowShortIcon direction="right" width="14" height="14" />
        </button>
      </div>
    </nav>
  )
}

export default Pagination
