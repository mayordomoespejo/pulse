import { useEffect, useRef, useState } from 'react'

/**
 * Calculates the number of grid columns that fit within a container, updating
 * reactively on resize.
 *
 * @param {Object} params
 * @param {number} params.minCardWidth  Minimum width of a single card in pixels.
 * @param {number} params.columnGap     Gap between columns in pixels.
 * @returns {{ containerRef: React.RefObject<HTMLElement>, columns: number }}
 */
function useGridColumns({ minCardWidth, columnGap }) {
  const containerRef = useRef(null)
  const [columns, setColumns] = useState(1)

  useEffect(() => {
    const calculateColumns = () => {
      const availableWidth = containerRef.current?.clientWidth || window.innerWidth
      const next = Math.max(
        1,
        Math.floor((availableWidth + columnGap) / (minCardWidth + columnGap)),
      )
      setColumns((prev) => (prev === next ? prev : next))
    }

    calculateColumns()

    const resizeObserver = new ResizeObserver(calculateColumns)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    window.addEventListener('resize', calculateColumns)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', calculateColumns)
    }
  }, [minCardWidth, columnGap])

  return { containerRef, columns }
}

export default useGridColumns
